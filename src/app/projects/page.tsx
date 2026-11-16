import type { Metadata } from "next";
import { Pills, Row } from "@/components/Row";
import { content } from "@/lib/content";
import { externalProps, Inline } from "@/lib/inline";

const { labels } = content;

export const metadata: Metadata = { title: labels.projects_heading };

export default function ProjectsPage() {
  return (
    <div className="page projects">
      <h1 className="page-title">{labels.projects_heading}</h1>
      {content.projects.length > 0 && (
        <ul className="rows">
          {content.projects.map((p, i) => (
            <Row key={i} when={p.year}>
              <h2 className="row-title">{p.title}</h2>
              {p.summary && (
                <p className="row-desc">
                  <Inline text={p.summary} />
                </p>
              )}
              {(p.stack.length > 0 || p.live || p.source || p.status) && (
                <div className="proj-meta">
                  <Pills items={p.stack} />
                  {p.status && <span className="status">{p.status}</span>}
                  {p.live && (
                    <a href={p.live} {...externalProps(p.live)}>
                      {p.live_label ?? labels.live_link} ↗
                    </a>
                  )}
                  {p.source && (
                    <a href={p.source} {...externalProps(p.source)}>
                      {p.source_label ?? labels.source_link} ↗
                    </a>
                  )}
                </div>
              )}
            </Row>
          ))}
        </ul>
      )}
    </div>
  );
}
