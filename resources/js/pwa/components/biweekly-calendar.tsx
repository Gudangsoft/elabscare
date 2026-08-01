import { Button } from '@/pwa/components/ui/button'; // Pastikan path ini benar
import { cn } from '@/pwa/lib/utils';
import { eachDayOfInterval, format, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface Props {
    selected: Date | null | undefined;
    onSelect: (date: Date) => void;
}

const BiWeeklyCalendar: React.FC<Props> = ({ selected, onSelect }: Props) => {
    const today: Date = selected || new Date();
    const startOfFirstWeek: Date = startOfWeek(today, { weekStartsOn: 0 });

    const daysInTwoWeeks: Date[] = eachDayOfInterval({
        start: startOfFirstWeek,
        end: new Date(startOfFirstWeek.getFullYear(), startOfFirstWeek.getMonth(), startOfFirstWeek.getDate() + 13),
    });

    const dayNames: string[] = Array.from(new Set(daysInTwoWeeks.map((day) => format(day, 'EEE', { locale: enUS }))));

    return (
        <div className="flex flex-col items-center rounded-md border border-none">
            {/* Header Hari (Min, Sen, Sel, dll.) */}
            <div className="mb-2 flex w-full justify-around">
                {dayNames.map((dayName: string) => (
                    <div key={dayName} className="flex-1 text-center">
                        {' '}
                        <div className="text-sm font-medium text-muted-foreground select-none">{dayName}</div>
                    </div>
                ))}
            </div>

            <div className="grid w-full grid-cols-7 gap-1">
                {' '}
                {daysInTwoWeeks.map((day: Date) => {
                    const isToday: boolean = day.toDateString() === new Date().toDateString();
                    const isSelected: boolean = selected ? day.toDateString() === selected.toDateString() : false;

                    return (
                        <Button
                            key={day.toISOString()}
                            variant={isSelected ? 'default' : 'ghost'}
                            size="icon"
                            className={cn(
                                'flex aspect-square size-auto w-full flex-col gap-1 leading-none font-normal text-black',
                                isToday && !isSelected && 'bg-transparent',
                                isSelected && 'bg-gradient-to-br from-teal-400 to-teal-500 text-white hover:bg-red-400',
                            )}
                            onClick={() => onSelect(day)}
                        >
                            {format(day, 'd')}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default BiWeeklyCalendar;
