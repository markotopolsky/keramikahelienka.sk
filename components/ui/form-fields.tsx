import type { ReactNode } from "react";

// Inputs take their background from --field, set by the card around the form
export const fieldClasses =
  "mt-2 block w-full rounded-xl border border-sage bg-(--field) px-4 py-3 text-base text-ink transition-colors placeholder:text-drift/70 hover:border-sea focus:border-deep focus:outline-none";

export function Label({ htmlFor, required, children }: { htmlFor?: string; required?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[14px] font-medium text-ink">
      {children}
      {required && <span aria-hidden> *</span>}
    </label>
  );
}

type FieldProps = {
  id: string;
  label: string;
  name: string;
  type?: "text" | "tel" | "email" | "number";
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  defaultValue?: string;
  className?: string;
};

export function Field({ id, label, className = "", required = false, ...input }: FieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        required={required}
        inputMode={input.type === "number" ? "numeric" : undefined}
        {...input}
        className={fieldClasses}
      />
    </div>
  );
}

type SelectProps = { id: string; label: string; placeholder: string; name: string; options: string[]; required?: boolean };

export function Select({ id, label, placeholder, name, options, required = false }: SelectProps) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <select id={id} name={name} required={required} defaultValue="" className={`${fieldClasses} appearance-none pr-10`}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <svg
          viewBox="0 0 12 8"
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 mt-1 h-2 w-3 -translate-y-1/2 text-deep"
        >
          <path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/** A short set of radio pills for questions with two or three answers */
export function Choice({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: { value: string; label: string; disabled?: boolean }[];
  defaultValue?: string;
}) {
  return (
    <fieldset>
      <legend className="text-[14px] font-medium text-ink">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-full border border-sage bg-(--field) px-4 py-2 text-[15px] text-deep touch:py-2.5 transition-colors duration-300 has-checked:border-deep has-checked:bg-deep has-checked:text-sand has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-sea ${
              option.disabled ? "cursor-not-allowed opacity-50" : "hover:border-sea"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              disabled={option.disabled}
              defaultChecked={option.value === defaultValue}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A single required checkbox, e.g. agreeing to the terms */
export function Checkbox({ id, name, required, children }: { id: string; name: string; required?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink touch:py-2.5">
      <input id={id} name={name} type="checkbox" required={required} className="mt-0.5 size-4 shrink-0 accent-deep" />
      {/* One flex item, so a link inside the text wraps with it instead of becoming a separate column */}
      <span>{children}</span>
    </label>
  );
}
