require("dotenv").config();

const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});

global.window = dom.window;
global.document = dom.window.document;
global.self = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.MutationObserver = dom.window.MutationObserver;
global.Node = dom.window.Node;
global.getComputedStyle = dom.window.getComputedStyle;
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (handle) => clearTimeout(handle);
global.IS_REACT_ACT_ENVIRONMENT = true;
Object.defineProperty(global, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});

if (!process.env.RPC_URL) {
  throw new Error("RPC_URL must be set in react/.env to run live RPC tests");
}
