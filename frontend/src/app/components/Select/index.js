import {
  createListCollection,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@chakra-ui/react";

const Select = ({
  items,
  label,
  value: inputValue,
  onChange,
  placeholder,
  ...rest
}) => {
  const frameworks = createListCollection({
    items,
  });

  const value = Array.isArray(inputValue) ? inputValue : [inputValue];

  return (
    <SelectRoot
      collection={frameworks}
      size="sm"
      width="320px"
      value={value}
      defaultValue={value}
      onValueChange={onChange}
      {...rest}
    >
      <SelectLabel>{label}</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {frameworks.items.map((item) => (
          <SelectItem item={item} key={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default Select;
