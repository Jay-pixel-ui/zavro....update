import { Component } from "react";
import { SITE, mailLink } from "@/data/site";

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div className="mx-auto max-w-xl px-5 py-40 text-center" role="alert">
        <h1 className="font-display text-2xl">Something didn't load.</h1>
        <p className="mt-4 text-z-body">Please refresh the page, or contact us directly at <a className="text-z-eyebrow underline" href={mailLink()}>{SITE.email}</a>.</p>
      </div>
    );
  }
}
