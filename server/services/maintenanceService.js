import { db } from "../database.js";

function effectiveStatus(row) {
  if (row.status === "completed" || row.completed_at) return "completed";
  if (row.due_mileage !== null && row.vehicle_mileage >= row.due_mileage) return "overdue";
  if (row.due_mileage !== null && row.due_mileage - row.vehicle_mileage <= 1000) return "due_soon";
  if (row.due_date) {
    const days = Math.ceil((Date.parse(row.due_date) - Date.now()) / 86_400_000);
    if (days < 0) return "overdue";
    if (days <= 30) return "due_soon";
  }
  return "scheduled";
}

function mapTask(row) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    type: row.type,
    status: effectiveStatus(row),
    storedStatus: row.status,
    dueMileage: row.due_mileage,
    dueDate: row.due_date,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    vehicle: { id: row.vehicle_id, plate: row.plate, make: row.make, model: row.model, mileage: row.vehicle_mileage, driver: row.driver_name, city: row.city },
  };
}

const TASK_SELECT = `
  SELECT m.*, v.plate, v.make, v.model, v.mileage AS vehicle_mileage, v.driver_name, v.city
  FROM maintenance m JOIN vehicles v ON v.id = m.vehicle_id
`;

export function listMaintenance({ status } = {}) {
  const tasks = db.prepare(`${TASK_SELECT} ORDER BY COALESCE(m.completed_at, m.due_date, m.created_at) DESC`).all().map(mapTask);
  return status ? tasks.filter((task) => task.status === status) : tasks;
}

export function listVehicleMaintenance(vehicleId) {
  return db.prepare(`${TASK_SELECT} WHERE m.vehicle_id = ? ORDER BY m.created_at DESC`).all(vehicleId).map(mapTask);
}

export function createMaintenance(vehicleId, input) {
  if (!db.prepare("SELECT 1 FROM vehicles WHERE id = ?").get(vehicleId)) return null;
  const result = db.prepare("INSERT INTO maintenance (vehicle_id, type, status, due_mileage, due_date, created_at) VALUES (?, ?, 'scheduled', ?, ?, ?)")
    .run(vehicleId, input.type, input.dueMileage ?? input.mileage ?? null, input.dueDate ?? null, new Date().toISOString());
  return listVehicleMaintenance(vehicleId).find((task) => task.id === Number(result.lastInsertRowid));
}

export function updateMaintenance(vehicleId, taskId, input) {
  const current = db.prepare("SELECT * FROM maintenance WHERE id = ? AND vehicle_id = ?").get(taskId, vehicleId);
  if (!current) return null;
  db.prepare("UPDATE maintenance SET type = ?, due_mileage = ?, due_date = ? WHERE id = ? AND vehicle_id = ?")
    .run(input.type ?? current.type, input.dueMileage ?? current.due_mileage, input.dueDate ?? current.due_date, taskId, vehicleId);
  return listVehicleMaintenance(vehicleId).find((task) => task.id === Number(taskId));
}

export function completeMaintenance(vehicleId, taskId, mileage) {
  const task = db.prepare("SELECT * FROM maintenance WHERE id = ? AND vehicle_id = ?").get(taskId, vehicleId);
  if (!task) return null;
  const vehicle = db.prepare("SELECT mileage FROM vehicles WHERE id = ?").get(vehicleId);
  const completionMileage = mileage ?? vehicle.mileage;
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    db.prepare("UPDATE maintenance SET status = 'completed', completed_at = ? WHERE id = ? AND vehicle_id = ?").run(now, taskId, vehicleId);
    db.prepare("UPDATE vehicles SET last_service_mileage = ?, updated_at = ? WHERE id = ?").run(completionMileage, now, vehicleId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return listVehicleMaintenance(vehicleId).find((item) => item.id === Number(taskId));
}

export function deleteMaintenance(vehicleId, taskId) {
  return db.prepare("DELETE FROM maintenance WHERE id = ? AND vehicle_id = ?").run(taskId, vehicleId).changes > 0;
}
