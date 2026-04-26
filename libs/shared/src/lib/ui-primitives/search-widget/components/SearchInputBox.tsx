/**
 * @section UI Atom - Search Input Box
 * @description Campo de entrada purificado con indicadores de estado y atajos.
 * Protocolo OEDP-V16.0 - Atomic Visual DNA.
 */

import React from 'react';
import { Command, Loader2, Search } from 'lucide-react';
import { GlobalStyleClassMerger } from '../../../utility/GlobalStyleMerger';

interface ISearchInputBoxProperties {
  readonly inputReference: React.RefObject<HTMLInputElement | null>;
  readonly isFocusedBoolean: boolean;
  readonly isExecutingBoolean: boolean;
  readonly valueLiteral: string;
  readonly placeholderLiteral: string;
  readonly accessibilityLabelLiteral: string;
  readonly onValueChangeAction: (value: string) => void;
  readonly onFocusAction: () => void;
  readonly onBlurAction: () => void;
}

export const SearchInputBox: React.FC<ISearchInputBoxProperties> = ({
  inputReference,
  isFocusedBoolean,
  isExecutingBoolean,
  valueLiteral,
  placeholderLiteral,
  accessibilityLabelLiteral,
  onValueChangeAction,
  onFocusAction,
  onBlurAction
}) => {
  const containerStylesLiteral = GlobalStyleClassMerger(
    "relative flex items-center w-full transition-all duration-500 rounded-xl border-2 overflow-hidden",
    isFocusedBoolean
      ? "border-amber-500 bg-white shadow-lg ring-4 ring-amber-500/10"
      : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
  );

  return (
    <div className={containerStylesLiteral}>
      <div className="pl-4 text-slate-400">
        {isExecutingBoolean ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
      </div>

      <input
        ref={inputReference}
        type="text"
        autoComplete="off"
        className="w-full py-3 px-4 bg-transparent outline-none text-slate-800 font-medium placeholder:text-slate-400 text-sm"
        placeholder={placeholderLiteral}
        value={valueLiteral}
        onFocus={onFocusAction}
        onBlur={onBlurAction}
        onChange={(event) => onValueChangeAction(event.target.value)}
        aria-label={accessibilityLabelLiteral}
      />

      <div className="hidden md:flex items-center pr-3">
        <kbd className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-slate-500 bg-white border border-slate-300 rounded-md shadow-sm">
          <Command size={10} />
          <span>K</span>
        </kbd>
      </div>
    </div>
  );
};
