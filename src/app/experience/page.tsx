import type { Metadata } from "next";
import { Pills, Row } from "@/components/Row";
import { content, pillColor } from "@/lib/content";
import { externalProps, Inline } from "@/lib/inline";

const { labels } = content;

export const metadata: Metadata = { title: labels.experience_heading };

export default function ExperiencePage() {
  return (
    <div className="page experience-page">
      <h1 className="page-title">{labels.experience_heading}</h1>
      {content.experience.length > 0 && (
        <ul className="rows">
          {content.experience.map((job, i) => (
            <Row key={i} when={job.dates}>
              <h2 className="row-title">
                {job.title} ·{" "}
                {job.company_url ? (
                  <a href={job.company_url} {...externalProps(job.company_url)}>
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </h2>
              {job.summary && (
                <p className="row-desc">
                  <Inline text={job.summary} />
                </p>
              )}
              <Pills items={job.stack} colorOf={pillColor} />
            </Row>
          ))}
        </ul>
      )}
    </div>
  );
}
