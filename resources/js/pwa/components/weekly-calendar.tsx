import { cn } from '@/pwa/lib/utils';
import { eachDayOfInterval, format, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Button } from './ui/button';

interface Props {
    selected: Date | null | undefined;
    onSelect: (date: Date) => void;
}

const WeeklyCalendar: React.FC<Props> = ({ selected, onSelect }: Props) => {
    const today: Date = selected || new Date();
    const startOfCurrentWeek: Date = startOfWeek(today, { weekStartsOn: 0 });
    const daysInCurrentWeek: Date[] = eachDayOfInterval({
        start: startOfCurrentWeek,
        end: new Date(startOfCurrentWeek.getFullYear(), startOfCurrentWeek.getMonth(), startOfCurrentWeek.getDate() + 6),
    });

    return (
        <div className="flex flex-col items-center rounded-md border border-none">
            <div className="mb-2 flex w-full justify-around">
                {daysInCurrentWeek.map((day: Date) => (
                    <div key={day.toISOString()} className="text-center">
                        <div className="text-sm font-medium text-muted-foreground select-none">{format(day, 'EEE', { locale: enUS })}</div>
                    </div>
                ))}
            </div>

            <div className="flex w-full justify-around">
                {daysInCurrentWeek.map((day: Date) => {
                    const isToday: boolean = day.toDateString() === new Date().toDateString();
                    const isSelected: boolean = selected ? day.toDateString() === selected.toDateString() : false;

                    return (
                        <Button
                            key={day.toISOString()}
                            variant={isSelected ? 'default' : 'ghost'}
                            size="icon"
                            className={cn(
                                'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal text-black',
                                isToday && !isSelected && 'bg-transparent',
                                isSelected && 'bg-gradient-to-br from-teal-400 to-teal-500 text-white hover:bg-secondary',
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

export default WeeklyCalendar;
