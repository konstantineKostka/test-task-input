import React, {useCallback, useEffect, useState} from "react";
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
  loading: boolean;
  onChange?: OptionHandler<T>;
  getOptionLabel: (option: T) => string;
}

function SearchSelectInput<T extends Item>({
                                             onSearch,
                                             options,
                                             loading,
                                             onChange,
                                             getOptionLabel
                                           }: Props<T>) {
  const [value, setValue] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const debouncedValue = useDebounce<string>(searchPhrase, 800);

  useEffect(() => {
    value && onChange && onChange(value);
  }, [value, onChange]);

  const handleChange = useCallback((e) => {
    if (!touched) setTouched(true);
    setValue(null);
    setSearchPhrase(e.target.value ?? "");
  }, [touched]);

  useEffect(() => {
    touched && onSearch(debouncedValue);
  }, [debouncedValue, touched, onSearch])

  useEffect(() => {
    options.length && setOpen(true);
  }, [options.length])

  const handleFocus = useCallback(() => {
    if (touched && !open) setOpen(true);
  }, [touched, open])

  const handleOptionClick = useCallback((option: T) => {
    setOpen(false);
    setValue(option);
  }, [])

  return (
    <div className={s.inputWrapper}>
      <input
        onChange={handleChange}
        type="text"
        onFocus={handleFocus}
        value={value ? getOptionLabel(value) : searchPhrase}
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