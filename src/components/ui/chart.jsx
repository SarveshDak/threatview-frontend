import * as React from "react";
import { ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts";

import { cn } from "@/lib/utils";

// Theme selectors used for generating CSS variables for theme-aware colors
const THEMES = { light: "", dark: ".dark" };

/**
 * Chart configuration shape (JS runtime expectations)
 * Example:
 * {
 *   value: { color: "#0ea5e9", label: "Value", icon: MyIcon },
 *   other: { theme: { light: "#fff", dark: "#333" }, label: "Other" }
 * }
 */

/* -------------------------
   Chart context + hook
   ------------------------- */
const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer");
  }
  return context;
}

/* -------------------------
   ChartContainer
   - Provides Chart context
   - Injects theme CSS variables for series
   - Wraps children in ResponsiveContainer
   ------------------------- */
const ChartContainer = React.forwardRef(({ id, className, children, config = {}, ...props }, ref) => {
  const uniqueId = React.useId?.() ?? `${Math.random().toString(36).slice(2, 9)}`;
  const chartId = `chart-${(id || uniqueId).replace(/[:]/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-dot]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

/* -------------------------
   ChartStyle
   - Creates CSS variables for each configured key (series)
   ------------------------- */
function ChartStyle({ id, config = {} }) {
  // collect keys that have either color or theme
  const colorConfig = Object.entries(config).filter(([, c]) => !!(c && (c.theme || c.color)));
  if (!colorConfig.length) return null;

  // Build CSS for each theme
  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const lines = colorConfig
        .map(([key, itemConfig]) => {
          // If theme object present, prefer theme[theme], else color
          const themeColor = itemConfig?.theme?.[theme];
          const color = themeColor || itemConfig?.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");

      return `${prefix} [data-chart=${id}] {\n${lines}\n}\n`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
ChartStyle.displayName = "ChartStyle";

/* -------------------------
   Helper: getPayloadConfigFromPayload
   - Given config and a recharts payload item, tries to pick the matching config entry
   - key argument is the candidate key (dataKey)
   ------------------------- */
function getPayloadConfigFromPayload(config = {}, payload = {}, key) {
  if (!config || typeof config !== "object") return undefined;
  if (!payload || typeof payload !== "object") return undefined;

  // sometimes value is under payload.payload when Recharts passes nested info
  const inner = payload.payload && typeof payload.payload === "object" ? payload.payload : payload;

  // prefer direct key, else fallback to dataKey/name fields
  const candidates = [key, payload.dataKey, payload.name].filter(Boolean);
  for (const k of candidates) {
    if (k in config) return config[k];
  }

  // final fallback: return undefined
  return undefined;
}

/* -------------------------
   ChartTooltipContent
   - A flexible tooltip renderer for Recharts' <Tooltip content={...} />
   ------------------------- */
const ChartTooltipContent = React.forwardRef(function ChartTooltipContent(
  {
    active,
    payload,
    label,
    labelFormatter,
    formatter,
    color,
    hideLabel = false,
    hideIndicator = false,
    indicator = "dot",
    nameKey,
    labelKey,
    className,
  },
  ref
) {
  const { config } = useChart();

  if (!active || !payload || !payload.length) {
    return null;
  }

  // Build label (top section)
  const tooltipLabel = React.useMemo(() => {
    if (hideLabel) return null;
    // choose label priority: label prop > first payload.label > first payload.name > first payload.dataKey
    const first = payload[0];
    const labelValue =
      label ??
      (first && (first.payload?.[labelKey] ?? first.name ?? first.dataKey ?? null)) ??
      null;

    if (labelFormatter && labelValue != null) {
      return <div className={cn("text-sm font-medium", className)}>{labelFormatter(labelValue, payload)}</div>;
    }
    if (labelValue == null) return null;
    return <div className="text-sm font-medium">{String(labelValue)}</div>;
  }, [hideLabel, label, labelFormatter, payload, labelKey, className]);

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}

      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          // item may be like { dataKey, value, payload, color, name }
          const key = nameKey || item.name || item.dataKey || "value";
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || (item.payload && item.payload.fill) || item.color || itemConfig?.color;

          // formatted content
          const humanValue = item.value != null ? item.value : item.payload?.[key];

          return (
            <div
              key={String(item.dataKey ?? index)}
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && humanValue !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                          "h-2.5 w-2.5": indicator === "dot",
                          "w-1": indicator === "line",
                          "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                          "my-0.5": nestLabel && indicator === "dashed",
                        })}
                        style={{
                          ["--color-bg"]: indicatorColor,
                          ["--color-border"]: indicatorColor,
                        }}
                      />
                    )
                  )}

                  <div className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">{itemConfig?.label ?? item.name ?? key}</span>
                    </div>

                    {humanValue != null ? (
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {typeof humanValue === "number" ? humanValue.toLocaleString() : String(humanValue)}
                      </span>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
ChartTooltipContent.displayName = "ChartTooltipContent";

/* -------------------------
   ChartTooltip wrapper for Recharts
   Usage: <Tooltip content={<ChartTooltipContent ...props />} />
   ------------------------- */
const ChartTooltip = (props) => {
  // Recharts passes the 'content' prop as a node (component instance)
  // We provide a wrapper that uses Recharts' Tooltip but keeps our custom content
  const { content, ...rest } = props;
  return <RechartsTooltip {...rest} content={content} />;
};

/* -------------------------
   ChartLegendContent
   - Custom legend rendering (icons/colors drawn from config)
   ------------------------- */
const ChartLegendContent = React.forwardRef(({ payload = [], hideIcon = false, verticalAlign = "bottom", nameKey, className }, ref) => {
  const { config } = useChart();

  if (!payload || !payload.length) return null;

  return (
    <div ref={ref} className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {payload.map((item) => {
        const key = (nameKey || item.dataKey || item.value || "value");
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        const color = itemConfig?.color ?? (item.color || item.payload?.fill);

        return (
          <div key={String(item.value ?? item.dataKey)} className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}>
            {!hideIcon ? (
              itemConfig?.icon ? <itemConfig.icon /> : <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />
            ) : null}
            <span>{itemConfig?.label ?? item.value ?? item.dataKey}</span>
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

/* -------------------------
   Exports
   ------------------------- */

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
};
