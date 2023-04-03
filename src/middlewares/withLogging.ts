import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./types";

export const withLogging: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const logs: any[] = [request.method, request.nextUrl.pathname];
    if (request.body) {
      logs.push(request.body);
    }
    console.log(...logs);
    return next(request, _next);
  };
};
