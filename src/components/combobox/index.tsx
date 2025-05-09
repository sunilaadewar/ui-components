import React, { useState, useRef, useEffect } from "react";

type ComboBoxProps = {
	options: string[];
	placeholder?: string;
	onSelect?: (value: string) => void;
};

export const ComboBox: React.FC<ComboBoxProps> = ({
	options,
	placeholder = "Select...",
	onSelect,
}) => {
	const [inputValue, setInputValue] = useState("");
	const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const matches = options.filter((opt) =>
			opt.toLowerCase().includes(inputValue.toLowerCase())
		);
		setFilteredOptions(matches);
		setHighlightedIndex(matches.length > 0 ? 0 : -1);
	}, [inputValue, options]);

	const handleInputFocus = () => {
		if (filteredOptions.length > 0) setIsOpen(true);
	};

	const handleInputBlur = (e: React.FocusEvent) => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setIsOpen(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			!isOpen &&
			filteredOptions.length > 0 &&
			(e.key === "ArrowDown" || e.key === "ArrowUp")
		) {
			setIsOpen(true);
			return;
		}

		switch (e.key) {
			case "ArrowDown":
				setHighlightedIndex((prev) =>
					Math.min(prev + 1, filteredOptions.length - 1)
				);
				break;
			case "ArrowUp":
				setHighlightedIndex((prev) => Math.max(prev - 1, 0));
				break;
			case "Enter":
				if (highlightedIndex >= 0) {
					const selected = filteredOptions[highlightedIndex];
					setInputValue(selected);
					onSelect?.(selected);
					setIsOpen(false);
				}
				break;
			case "Escape":
				setIsOpen(false);
				break;
		}
	};

	const handleOptionClick = (option: string) => {
		setInputValue(option);
		onSelect?.(option);
		setIsOpen(false);
	};

	console.log(filteredOptions);
	console.log(highlightedIndex);
	console.log(inputValue);

	return (
		<div
			className="combo-box"
			onBlur={handleInputBlur}>
			<input
				type="text"
				role="combobox"
				aria-expanded={isOpen}
				aria-controls="combo-list"
				aria-autocomplete="list"
				aria-activedescendant={
					highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
				}
				ref={inputRef}
				placeholder={placeholder}
				value={inputValue}
				onFocus={handleInputFocus}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				className="border p-2 w-full rounded"
			/>
			{isOpen && (
				<ul
					id="combo-list"
					role="listbox"
					ref={listRef}
					className="border rounded mt-1 max-h-60 overflow-auto bg-white shadow z-10">
					{filteredOptions.length === 0 ? (
						<li className="p-2 text-gray-500">No results</li>
					) : (
						filteredOptions.map((option, index) => (
							<li
								key={option}
								id={`option-${index}`}
								role="option"
								aria-selected={highlightedIndex === index}
								onMouseDown={() => handleOptionClick(option)}
								className={`p-2 cursor-pointer ${
									highlightedIndex === index ? "bg-blue-500 text-white" : ""
									// highlightedIndex === index
									// 	? inputValue.trim().length >= 2
									// 		? "bg-blue-500 text-white"
									// 		: ""
									// 	: ""
								}`}>
								{option}
							</li>
						))
					)}
				</ul>
			)}
		</div>
	);
};
