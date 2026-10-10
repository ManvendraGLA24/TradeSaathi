import type { ReactNode } from "react";
import shell from "./shell.module.css";
import styles from "./static-module.module.css";
import { PageHeader } from "./PageHeader";

export interface StaticMetric {
  label: string;
  value: string;
  change?: string;
  tone?: "up" | "down" | "accent";
}

export interface StaticCard {
  title: string;
  description: string;
  value?: string;
  change?: string;
  tag?: string;
  tone?: "up" | "down" | "accent";
}

export interface StaticTable {
  columns: string[];
  rows: string[][];
}

export interface StaticBlock {
  title: string;
  description?: string;
  cards?: StaticCard[];
  table?: StaticTable;
  bars?: { label: string; value: string; height: number; tone?: "up" | "down" }[];
}

export interface StaticField {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "number" | "date";
}

export function StaticModulePage({
  title,
  icon,
  description,
  metrics = [],
  filters = [],
  cards = [],
  table,
  blocks = [],
  fields = [],
  actionLabel,
}: {
  title: string;
  icon?: ReactNode;
  description: string;
  metrics?: StaticMetric[];
  filters?: string[];
  cards?: StaticCard[];
  table?: StaticTable;
  blocks?: StaticBlock[];
  fields?: StaticField[];
  actionLabel?: string;
}) {
  return (
    <div className={`${shell.page} ${styles.page}`}>
      <PageHeader icon={icon} title={title} />

      <div className={styles.intro}>
        <p>{description}</p>
        <span className={styles.previewTag}>UI PREVIEW · SAMPLE DATA</span>
      </div>

      {metrics.length > 0 && (
        <div className={styles.metrics}>
          {metrics.map((metric) => (
            <article className={styles.metric} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              {metric.change && (
                <small className={metric.tone === "down" ? styles.down : styles.up}>
                  {metric.change}
                </small>
              )}
            </article>
          ))}
        </div>
      )}

      {filters.length > 0 && (
        <div className={styles.toolbar} aria-label="Preview filters">
          {filters.map((filter, index) => (
            <label className={styles.filter} key={filter}>
              <span>{filter}</span>
              <select aria-label={filter} defaultValue={index === 0 ? "All" : "Today"}>
                <option>All</option>
                <option>Today</option>
                <option>This week</option>
              </select>
            </label>
          ))}
          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Search symbols" aria-label="Search symbols" />
          </label>
        </div>
      )}

      {cards.length > 0 && (
        <div className={styles.cards}>
          {cards.map((card) => (
            <PreviewCard card={card} key={card.title} />
          ))}
        </div>
      )}

      {table && <PreviewTable table={table} />}

      {blocks.map((block) => (
        <section className={styles.block} key={block.title}>
          <header className={styles.blockHeader}>
            <div>
              <h2>{block.title}</h2>
              {block.description && <p>{block.description}</p>}
            </div>
            <span className={styles.blockCount}>
              {block.table ? `${block.table.rows.length} rows` : "Preview"}
            </span>
          </header>

          {block.bars && (
            <div className={styles.chart} aria-label={`${block.title} sample chart`}>
              {block.bars.map((bar) => (
                <div className={styles.barColumn} key={bar.label}>
                  <strong className={bar.tone === "down" ? styles.down : styles.up}>{bar.value}</strong>
                  <div className={styles.barTrack}>
                    <span
                      className={`${styles.bar} ${bar.tone === "down" ? styles.barDown : ""}`}
                      style={{ height: `${Math.max(8, Math.min(100, bar.height))}%` }}
                    />
                  </div>
                  <small>{bar.label}</small>
                </div>
              ))}
            </div>
          )}

          {block.cards && (
            <div className={styles.cards}>
              {block.cards.map((card) => (
                <PreviewCard card={card} key={card.title} />
              ))}
            </div>
          )}

          {block.table && <PreviewTable table={block.table} />}
        </section>
      ))}

      {fields.length > 0 && (
        <section className={styles.formPanel}>
          <div className={styles.blockHeader}>
            <div>
              <h2>{title}</h2>
              <p>Form preview only. Nothing is submitted or saved.</p>
            </div>
          </div>
          <div className={styles.formGrid}>
            {fields.map((field) => (
              <label key={field.label}>
                <span>{field.label}</span>
                <input type={field.type ?? "text"} placeholder={field.placeholder} />
              </label>
            ))}
          </div>
          {actionLabel && <button type="button" className={styles.action}>{actionLabel}</button>}
        </section>
      )}

      <p className={styles.disclaimer}>
        Static interface preview. Figures and names are illustrative, not live market data.
      </p>
    </div>
  );
}

function PreviewCard({ card }: { card: StaticCard }) {
  const tone = card.tone === "down" ? styles.down : card.tone === "up" ? styles.up : styles.accent;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardIcon}>{card.title.slice(0, 1)}</span>
        {card.tag && <span className={styles.tag}>{card.tag}</span>}
      </div>
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      {card.value && <strong className={`${styles.cardValue} ${tone}`}>{card.value}</strong>}
      {card.change && <small className={tone}>{card.change}</small>}
    </article>
  );
}

function PreviewTable({ table }: { table: StaticTable }) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((value, cellIndex) => (
                <td key={`${cellIndex}-${value}`} className={cellIndex > 1 ? styles.numeric : ""}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
