import type { TFunction } from "i18next";

/**
 * Builds the duration summary shown next to the event type's "Basics" tab, e.g. "15 mins".
 * The duration field can be left empty while editing, which makes `length` NaN, so the
 * label is omitted until a duration is entered again.
 */
export const getDurationLabel = ({
  length,
  multipleDuration,
  t,
}: {
  length: number | undefined;
  multipleDuration?: number[];
  t: TFunction;
}) => {
  if (multipleDuration?.length) {
    return `${multipleDuration.map((duration) => ` ${duration}`)} ${t("minute_timeUnit")}`;
  }

  if (length === undefined || !Number.isFinite(length)) {
    return "";
  }

  return `${length} ${t("minute_timeUnit")}`;
};
