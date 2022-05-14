import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import PageHeader from "../commons/components/PageHeader";
import {BrowserRouter} from "react-router-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const renderHeader = <BrowserRouter><PageHeader header='test header'/></BrowserRouter>

it("header displays correctly", () => {
  act(() => {
    render(renderHeader, container)
  });
  expect(container.querySelector('#page-header__header-text').textContent).toBe('test header');
})