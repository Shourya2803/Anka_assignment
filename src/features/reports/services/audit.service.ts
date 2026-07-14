import prisma from "@/lib/prisma"

export async function createAuditLog(
  adminId: string,
  action: string,
  entity: string,
  entityId: string
) {
  try {
    return await prisma.auditLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
      },
    })
  } catch (error) {
    console.error("Failed to create audit log:", error)
  }
}
