import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-holiday',
  imports: [CommonModule, NgFor],
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css']
})
export class Holiday implements OnInit {
  currentMonth: Date = new Date();
  displayedMonth: Date = new Date();
  
  // Days of the week to be displayed
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // List of official holidays
  holidays: { date: Date, name: string }[] = [
    { date: new Date('2025-03-08'), name: 'International Women\'s Day' },
    { date: new Date('2025-03-29'), name: 'Good Friday' },
    { date: new Date('2025-04-14'), name: 'Tamil New Year' },
    { date: new Date('2025-04-21'), name: 'Ram Navami' },
    { date: new Date('2025-05-01'), name: 'Labour Day' },
    { date: new Date('2025-08-15'), name: 'Independence Day' },
    { date: new Date('2025-10-02'), name: 'Gandhi Jayanti' },
    { date: new Date('2025-11-01'), name: 'Diwali' },
    { date: new Date('2025-12-25'), name: 'Christmas' },
    { date: new Date('2025-04-09'), name: 'Shraddha bday'}
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  // Get all days in the displayed month including holidays and weekends
  getDaysInMonth(): { date: string, day: string, isHoliday: boolean, name: string }[] {
    const year = this.displayedMonth.getFullYear();
    const month = this.displayedMonth.getMonth();
    const days: { date: string, day: string, isHoliday: boolean, name: string }[] = [];

    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const dateObj = new Date(dateStr);
      const dayOfWeek = dateObj.getDay();

      let holidayName = '';
      let isHoliday = false;

      // Check if the date is a listed holiday
      const holiday = this.holidays.find(h => h.date.toISOString().split('T')[0] === dateStr);
      if (holiday) {
        holidayName = holiday.name;
        isHoliday = true;
      }

      // Check if it's a weekend (Saturday or Sunday)
      if (dayOfWeek === 6) { // Saturday
        holidayName = 'Saturday Off';
        isHoliday = true;
      } else if (dayOfWeek === 0) { // Sunday
        holidayName = 'Sunday Off';
        isHoliday = true;
      }

      days.push({ date: dateStr, day: this.weekDays[dayOfWeek], isHoliday, name: holidayName });
    }

    return days;
  }
  get groupedHolidays(): { [month: string]: { date: Date; name: string }[] } {
    return this.holidays.reduce((acc, holiday) => {
      const month = holiday.date.toLocaleString('default', { month: 'long' });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(holiday);
      return acc;
    }, {} as { [month: string]: { date: Date; name: string }[] });
  }
  

  // Navigate to the previous month
  prevMonth() {
    this.displayedMonth = new Date(this.displayedMonth.getFullYear(), this.displayedMonth.getMonth() - 1, 1);
    this.cdr.detectChanges(); // Ensure UI updates
  }

  // Navigate to the next month
  nextMonth() {
    this.displayedMonth = new Date(this.displayedMonth.getFullYear(), this.displayedMonth.getMonth() + 1, 1);
    this.cdr.detectChanges(); // Ensure UI updates
  }

  // Handle holiday click
  handleHolidayClick(date: string) {
    const holiday = this.getDaysInMonth().find(day => day.date === date);
    alert(holiday?.isHoliday ? `Holiday: ${holiday.name} on ${date}` : `No holiday on ${date}`);
  }
}
