import { Injectable } from '@nestjs/common';

// TODO: The data is really generic and depends on the model
type MiddlewareOperations = (data: any) => Promise<void>;
type SupportedOperations = 'deleteOne' | 'updateOne' | 'save';

/**
 * Mongoose supports middleware which can execute when certain operations
 * take place. The downside is that the middleware needs to be registerd
 * before the schema is compiled into the model. With NestJS, the model
 * compilation takes place at the module level.
 *
 * For example, say a middleware is needed for the "deleteOne" operation on
 * a study. The middleware could ideally be registered with the context of
 * the study service. However, the study service would not be available
 * yet since the middleware is registerd **before** the rest of the module
 * is loaded.
 *
 * This serivce allows for middleware to be registerd independetly by only
 * storing the callbacks. This service is then called by the Mongoose
 * middleware.
 *
 *
 * Mongoose Middleware:
 * https://mongoosejs.com/docs/middleware.html
 *
 * NestJS MongooseModule:
 * https://docs.nestjs.com/techniques/mongodb#hooks-middleware
 */
@Injectable()
export class MongooseMiddlewareService {
  /**
   * Supports storing middleware operations. For example
   *
   * middlewareOperations = {
   *  'Study': {
   *     'deleteOne': [callback1, callback2],
   *     'updateOne': [callback3]
   *   },
   *   'Project': {
   *     'deleteOne': [callback4]
   *   }
   * }
   */
  private middlewareOperations: Map<string, Map<SupportedOperations, MiddlewareOperations[]>> = new Map();

  register(modelName: string, operation: SupportedOperations, callback: MiddlewareOperations) {
    // If the model is not already registered, create a new map
    if (!this.middlewareOperations.has(modelName)) {
      this.middlewareOperations.set(modelName, new Map());
    }

    // Get all supported operations for the model
    const modelOperations = this.middlewareOperations.get(modelName)!;

    // Update the list of callbacks for the operation
    const callbacks = modelOperations.get(operation) || [];
    callbacks.push(callback);
    modelOperations.set(operation, callbacks);
  }

  async apply(modelName: string, operation: SupportedOperations, data: any): Promise<void> {
    // If there isn't any callbacks for the model, don't continue
    if (!this.middlewareOperations.has(modelName)) {
      return;
    }

    // Get the list of callbacks for the operation if there aren't any, don't continue
    const modelOperations = this.middlewareOperations.get(modelName)!;
    if (!modelOperations.has(operation)) {
      return;
    }

    // Apply all callbacks
    const callbacks = modelOperations.get(operation) || [];
    await Promise.all(callbacks.map((callback) => callback(data)));
  }
}
