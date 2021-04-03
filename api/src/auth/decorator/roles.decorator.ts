import { SetMetadata } from "@nestjs/common";

export const hasRoles = (...hasRoles)=>SetMetadata('roles', hasRoles)