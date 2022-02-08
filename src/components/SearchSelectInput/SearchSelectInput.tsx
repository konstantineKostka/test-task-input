import React, {useCallback, useEffect, useRef, useState} from "react";
import {CaretDownOutlined, CaretUpOutlined, SyncOutlined} from "@ant-design/icons";

import useDebounce from "../../hooks/useDebounce";
import DropDown from "../DropDown/DropDown";

import s from "./SearchSelectInput.module.css";

interface Item {
  id: string,
}

type OptionHandler<T> = (option: T) => void;

interface Props<T> {
  options: T[];
  onSearch: (term: string) => void;
  showItemValue?: boolean;
  loading: boolean;
  onChange?: OptionHandler<T>;
  getOptionLabel: (option: T) => string;
}

function SearchSelectInput<T extends Item>({
                                             onSearch,
                                             options,
                                             loading,
                                             onChange,
                                             showItemValue,
                                             getOptionLabel
                                           }: Props<T>) {
  const [value, setValue] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce<string>(searchPhrase, 800);

  useEffect(() => {
    value && onChange && onChange(value);
  }, [value, onChange]);

  useEffect(() => {
    if (!touched && debouncedValue) {
      setTouched(true);
    }
  }, [touched, debouncedValue]);

  const handleChange = useCallback((e) => {
    setValue(null);
    setOpen(false);
    setSearchPhrase(e.target.value ?? "");
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    if (touched) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, touched, onSearch])

  useEffect(() => {
    options.length && setOpen(true);
  }, [options])

  const handleFocus = useCallback(() => {
    if (touched && !open) setOpen(true);
  }, [touched, open])

  const handleOptionClick = useCallback((option: T) => {
    setOpen(false);
    setValue(option);
    focusInput();
  }, [focusInput])

  return (
    <div className={s.inputWrapper} onClick={focusInput}>
      <input
        onChange={handleChange}
        autoFocus
        ref={inputRef}
        type="text"
        onFocus={handleFocus}
        value={showItemValue && value ? getOptionLabel(value) : searchPhrase}
      />
      {loading ? <SyncOutlined spin/>
        : !open ? <CaretUpOutlined onClick={() => options.length && setOpen(true)}/>
          : <CaretDownOutlined/>
      }
      {(!!options.length && open) && <DropDown open={open} onClose={() => setOpen(false)}>
        <ul className={s.dropDownList}>
          {options.map((option, i) => (
            <li
              className={s.dropDownListItem}
              key={option.id}
              tabIndex={i}
              onClick={() => handleOptionClick(option)}
            >
              {getOptionLabel(option)}
            </li>
          ))}
        </ul>
      </DropDown>}
    </div>
  )
}

export default SearchSelectInput;