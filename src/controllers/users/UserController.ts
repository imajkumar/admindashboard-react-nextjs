import { BaseController } from "../BaseController";
import { UserService } from "../../services/userService";

export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserFilters {
  role?: string;
  status?: string;
  department?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface UserCreateData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
  department?: string;
  position?: string;
  phone?: string;
  avatar?: string;
}

export class UserController extends BaseController<User> {
  constructor() {
    super("User", new UserService());
  }

  // User-specific methods
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      this.log("info", `Getting users by role: ${role}`);
      const result = await (
        this.service as { getUsersByRole: (role: string) => Promise<User[]> }
      ).getUsersByRole(role);
      return result || [];
    } catch (error) {
      this.handleError(error, "getUsersByRole");
    }
  }

  async getUsersByDepartment(department: string): Promise<User[]> {
    try {
      this.log("info", `Getting users by department: ${department}`);
      const result = await (
        this.service as {
          getUsersByDepartment: (department: string) => Promise<User[]>;
        }
      ).getUsersByDepartment(department);
      return result || [];
    } catch (error) {
      this.handleError(error, "getUsersByDepartment");
    }
  }

  async getUserProfile(userId: string | number): Promise<User> {
    try {
      this.log("info", `Getting user profile: ${userId}`);
      const result = await (
        this.service as {
          getUserProfile: (userId: string | number) => Promise<User>;
        }
      ).getUserProfile(userId);
      if (!result) {
        throw new Error("User profile not found");
      }
      return result;
    } catch (error) {
      this.handleError(error, "getUserProfile");
    }
  }

  async updateUserProfile(
    userId: string | number,
    data: UserUpdateData,
  ): Promise<User> {
    try {
      this.log("info", `Updating user profile: ${userId}`);

      // Validate profile data
      const validationRules = {
        firstName: { required: true, minLength: 2, maxLength: 50 },
        lastName: { required: true, minLength: 2, maxLength: 50 },
        phone: { pattern: /^[+]?[1-9][\d]{0,15}$/ },
      };

      const validation = this.validateData(
        data as unknown as Record<string, unknown>,
        validationRules,
      );
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      const result = await (
        this.service as {
          updateUserProfile: (
            userId: string | number,
            data: UserUpdateData,
          ) => Promise<User>;
        }
      ).updateUserProfile(userId, data);
      return result;
    } catch (error) {
      this.handleError(error, "updateUserProfile");
    }
  }

  async changeUserStatus(
    userId: string | number,
    status: "active" | "inactive" | "suspended",
  ): Promise<User> {
    try {
      this.log("info", `Changing user status: ${userId} to ${status}`);
      const result = await (
        this.service as {
          toggleUserStatus: (
            userId: string | number,
            status: string,
          ) => Promise<User>;
        }
      ).toggleUserStatus(userId, status);
      return result;
    } catch (error) {
      this.handleError(error, "changeUserStatus");
    }
  }

  async changeUserRole(
    userId: string | number,
    newRole: string,
  ): Promise<User> {
    try {
      this.log("info", `Changing user role: ${userId} to ${newRole}`);
      const result = await (
        this.service as {
          changeUserRole: (
            userId: string | number,
            newRole: string,
          ) => Promise<User>;
        }
      ).changeUserRole(userId, newRole);
      return result;
    } catch (error) {
      this.handleError(error, "changeUserRole");
    }
  }

  async getUserActivity(
    userId: string | number,
    days: number = 30,
  ): Promise<unknown[]> {
    try {
      this.log("info", `Getting user activity: ${userId} for ${days} days`);
      const result = await (
        this.service as {
          getUserActivity: (
            userId: string | number,
            days: number,
          ) => Promise<unknown[]>;
        }
      ).getUserActivity(userId, days);
      return result || [];
    } catch (error) {
      this.handleError(error, "getUserActivity");
    }
  }

  async getUserStats(userId: string | number): Promise<unknown> {
    try {
      this.log("info", `Getting user stats: ${userId}`);
      const result = await (
        this.service as {
          getUserStats: (userId: string | number) => Promise<unknown>;
        }
      ).getUserStats(userId);
      return result || {};
    } catch (error) {
      this.handleError(error, "getUserStats");
    }
  }

  async sendPasswordReset(email: string): Promise<boolean> {
    try {
      this.log("info", `Sending password reset to: ${email}`);
      const result = await (
        this.service as {
          sendPasswordReset: (email: string) => Promise<boolean>;
        }
      ).sendPasswordReset(email);
      return result;
    } catch (error) {
      this.handleError(error, "sendPasswordReset");
    }
  }

  async bulkUpdateUsers(
    updates: Array<{ id: string | number; data: Partial<UserUpdateData> }>,
  ): Promise<User[]> {
    try {
      this.log("info", `Bulk updating ${updates.length} users`);
      const result = await (
        this.service as {
          bulkUpdate: (
            updates: Array<{
              id: string | number;
              data: Partial<UserUpdateData>;
            }>,
          ) => Promise<User[]>;
        }
      ).bulkUpdate(updates);
      return result || [];
    } catch (error) {
      this.handleError(error, "bulkUpdateUsers");
    }
  }

  // Override create method with user-specific validation
  async create(data: UserCreateData): Promise<User> {
    try {
      this.log("info", "Creating new user");

      // Validate user creation data
      const validationRules = {
        username: {
          required: true,
          minLength: 3,
          maxLength: 30,
          pattern: /^[a-zA-Z0-9_]+$/,
        },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        firstName: { required: true, minLength: 2, maxLength: 50 },
        lastName: { required: true, minLength: 2, maxLength: 50 },
        password: { required: true, minLength: 8 },
        role: { required: true },
      };

      const validation = this.validateData(
        data as unknown as Record<string, unknown>,
        validationRules,
      );
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      const result = await (
        this.service as { create: (data: UserCreateData) => Promise<User> }
      ).create(data);
      this.log("info", `User created successfully: ${result.id}`);
      return result;
    } catch (error) {
      this.handleError(error, "create");
    }
  }

  // Override search method with user-specific filters
  async search(query: string, filters?: UserFilters): Promise<User[]> {
    try {
      this.log("info", `Searching users with query: ${query}`);
      const result = await (
        this.service as {
          searchUsers: (
            query: string,
            filters?: UserFilters,
          ) => Promise<User[]>;
        }
      ).searchUsers(query, filters);
      return result || [];
    } catch (error) {
      this.handleError(error, "search");
    }
  }
}
