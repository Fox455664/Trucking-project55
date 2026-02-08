import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { saudiLocations } from "@/data/saudi-locations"

interface SmartLocationSelectProps {
  onSelect: (label: string, lat: number, lng: number) => void;
  placeholder?: string;
  iconColor?: string;
  defaultValue?: string;
}

export function SmartLocationSelect({ onSelect, placeholder, iconColor, defaultValue = "" }: SmartLocationSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 bg-white/50 border-muted-foreground/20 hover:bg-white text-right px-3"
        >
          <div className="flex items-center gap-2 truncate text-foreground">
            <MapPin className={cn("w-5 h-5 shrink-0", iconColor)} />
            {value
              ? saudiLocations.find((loc) => loc.value === value)?.label
              : <span className="text-muted-foreground font-normal">{placeholder || "اختر المدينة..."}</span>}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="ابحث عن مدينة..." className="text-right" />
          <CommandList>
            <CommandEmpty>لم يتم العثور على المدينة.</CommandEmpty>
            <CommandGroup>
              {saudiLocations.map((loc) => (
                <CommandItem
                  key={loc.value}
                  value={loc.label} // نبحث بالاسم العربي
                  onSelect={(currentValue) => {
                    // currentValue هنا تأتي من المكتبة وقد تكون معدلة، لذا نبحث في المصفوفة الأصلية
                    const selected = saudiLocations.find(l => l.label === currentValue || l.value === currentValue) || loc;
                    
                    setValue(selected.value)
                    onSelect(selected.label, selected.lat, selected.lng)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        value === loc.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {loc.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
