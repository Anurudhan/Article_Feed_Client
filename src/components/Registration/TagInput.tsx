import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={`border rounded-md px-2 py-1.5 flex flex-wrap gap-2 cursor-text min-h-[42px] transition-colors duration-200 ${
        isFocused 
          ? 'border-teal-500 ring-1 ring-teal-500' 
          : 'border-slate-300 hover:border-slate-400'
      }`}
      onClick={handleContainerClick}
    >
      {tags.map((tag, index) => (
        <div 
          key={index} 
          className="flex items-center bg-slate-100 text-slate-800 text-sm px-2 py-0.5 rounded-md"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="ml-1 text-slate-500 hover:text-slate-700"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        className="flex-grow min-w-[80px] outline-none text-sm py-0.5"
        placeholder={tags.length === 0 ? "Add tags..." : ""}
      />
    </div>
  );
};

export default TagInput;