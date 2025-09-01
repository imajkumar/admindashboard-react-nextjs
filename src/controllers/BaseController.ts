// Base Controller for all modules
export abstract class BaseController<T = unknown> {
  protected moduleName: string;
  protected service: unknown;

  constructor(moduleName: string, service: unknown) {
    this.moduleName = moduleName;
    this.service = service;
  }

  // Generic CRUD operations
  async getAll(
    filters?: unknown,
    pagination?: unknown,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    try {
      const result = await (
        this.service as {
          getList: (
            filters?: unknown,
            pagination?: unknown,
          ) => Promise<{
            data: T[];
            total: number;
            page: number;
            limit: number;
          }>;
        }
      ).getList(filters, pagination);
      return {
        data: result.data || [],
        total: result.total || 0,
        page: (pagination as { page?: number })?.page || 1,
        limit: (pagination as { limit?: number })?.limit || 10,
      };
    } catch (error) {
      throw new Error(
        `Failed to get ${this.moduleName} list: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getById(id: string | number): Promise<T> {
    try {
      const result = await (
        this.service as { getById: (id: string | number) => Promise<T> }
      ).getById(id);
      if (!result) {
        throw new Error(`${this.moduleName} not found`);
      }
      return result;
    } catch (error) {
      throw new Error(
        `Failed to get ${this.moduleName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const result = await (
        this.service as { create: (data: Partial<T>) => Promise<T> }
      ).create(data);
      return result;
    } catch (error) {
      throw new Error(
        `Failed to create ${this.moduleName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    try {
      const result = await (
        this.service as {
          update: (id: string | number, data: Partial<T>) => Promise<T>;
        }
      ).update(id, data);
      if (!result) {
        throw new Error(`${this.moduleName} not found`);
      }
      return result;
    } catch (error) {
      throw new Error(
        `Failed to update ${this.moduleName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async delete(id: string | number): Promise<boolean> {
    try {
      const result = await (
        this.service as { delete: (id: string | number) => Promise<boolean> }
      ).delete(id);
      return result;
    } catch (error) {
      throw new Error(
        `Failed to delete ${this.moduleName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async bulkDelete(ids: (string | number)[]): Promise<boolean> {
    try {
      const result = await (
        this.service as {
          bulkDelete: (ids: (string | number)[]) => Promise<boolean>;
        }
      ).bulkDelete(ids);
      return result;
    } catch (error) {
      throw new Error(
        `Failed to bulk delete ${this.moduleName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // Search functionality
  async search(query: string, filters?: unknown): Promise<T[]> {
    try {
      const result = await (
        this.service as {
          search: (query: string, filters?: unknown) => Promise<T[]>;
        }
      ).search(query, filters);
      return result || [];
    } catch (error) {
      throw new Error(
        `Failed to search ${this.moduleName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // Export functionality
  async export(
    format: "csv" | "excel" | "pdf" = "csv",
    filters?: unknown,
  ): Promise<string> {
    try {
      const result = await (
        this.service as {
          export: (
            format: "csv" | "excel" | "pdf",
            filters?: unknown,
          ) => Promise<string>;
        }
      ).export(format, filters);
      return result;
    } catch (error) {
      throw new Error(
        `Failed to export ${this.moduleName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // Import functionality
  async import(
    file: File,
    options?: unknown,
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const result = await (
        this.service as {
          import: (
            file: File,
            options?: unknown,
          ) => Promise<{ success: number; failed: number; errors: string[] }>;
        }
      ).import(file, options);
      return result;
    } catch (error) {
      throw new Error(
        `Failed to import ${this.moduleName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // Validation
  protected validateData(
    data: Record<string, unknown>,
    rules: {
      [key: string]: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
      };
    },
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [field, rule] of Object.entries(rules)) {
      if (rule.required && (!data[field] || data[field] === "")) {
        errors.push(`${field} is required`);
      }

      if (
        rule.minLength &&
        data[field] &&
        typeof data[field] === "string" &&
        data[field].length < rule.minLength
      ) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }

      if (
        rule.maxLength &&
        data[field] &&
        typeof data[field] === "string" &&
        data[field].length > rule.maxLength
      ) {
        errors.push(
          `${field} must be no more than ${rule.maxLength} characters`,
        );
      }

      if (
        rule.pattern &&
        data[field] &&
        typeof data[field] === "string" &&
        !rule.pattern.test(data[field])
      ) {
        errors.push(`${field} format is invalid`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Error handling
  protected handleError(error: unknown, operation: string): never {
    console.error(`[${this.moduleName}] ${operation} error:`, error);
    throw error;
  }

  // Logging
  protected log(
    level: "info" | "warn" | "error",
    message: string,
    data?: unknown,
  ): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${this.moduleName}] ${message}`;

    switch (level) {
      case "info":
        console.log(logMessage, data);
        break;
      case "warn":
        console.warn(logMessage, data);
        break;
      case "error":
        console.error(logMessage, data);
        break;
    }
  }

  // Get module info
  getModuleInfo(): { name: string; service: string; methods: string[] } {
    return {
      name: this.moduleName,
      service: (this.service as { constructor: { name: string } }).constructor
        .name,
      methods: Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(
        (method) => method !== "constructor" && !method.startsWith("_"),
      ),
    };
  }
}
