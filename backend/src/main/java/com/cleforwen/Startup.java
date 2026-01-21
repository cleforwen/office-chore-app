package com.cleforwen;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@ApplicationScoped
public class Startup {

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        if (TeamMember.count() > 0) {
            return;
        }

        // 1. Create 8+ Team Members
        String[] names = {
                "Alice", "Bob", "Charlie", "Dave", "Eve",
                "Frank", "Grace", "Heidi", "Ivan", "Judy"
        };

        // Persist and keep references
        TeamMember[] members = new TeamMember[names.length];
        for (int i = 0; i < names.length; i++) {
            TeamMember tm = new TeamMember();
            tm.name = names[i];
            tm.persist();
            members[i] = tm;
        }

        Random rand = new Random();
        LocalDate today = LocalDate.now();

        // 2. Create Recurring Chores (Foundation)
        createChore("Empty Dishwasher", "Morning routine", today, true, "DAILY", members[0]);
        createChore("Water Plants", "Office plants need love", today.plusDays(1), true, "WEEKLY", members[1]);
        createChore("Monthly Report", "Compile metrics", today.plusDays(5), true, "MONTHLY", members[2]);
        createChore("Submit Timesheets", "Don't forget!", today.with(java.time.DayOfWeek.FRIDAY), true, "WEEKLY",
                members[3]);
        createChore("Team Sync", "Weekly Standup", today.with(java.time.DayOfWeek.MONDAY), true, "WEEKLY", members[4]);
        createChore("Clean Fridge", "Throw out old food", today.withDayOfMonth(1), true, "MONTHLY", members[5]);
        createChore("Inventory Check", "Count supplies", today.withDayOfMonth(15), true, "MONTHLY", members[6]);
        createChore("Security Audit", "Check logs", today.withDayOfMonth(20), true, "MONTHLY", members[7]);

        // 3. Create ~15 One-time Chores spread around
        String[] tasks = {
                "Fix Printer Paper", "Order Coffee Beans", "Organize Cable Drawer",
                "Wipe Whiteboards", "Restock Snacks", "Clean Microwave",
                "Empty Recycling", "Check Fire Extinguishers", "Update Server OS",
                "Plan Holiday Party", "Call Plumber", "Replace Hallway Lightbulb",
                "Sort Incoming Mail", "Backup Database Manually", "Code Review Session",
                "Onboard New Hire", "Fix Coffee Machine", "Buy Birthday Cake"
        };

        for (String task : tasks) {
            // Random date between -5 and +15 days
            int offset = rand.nextInt(21) - 5;
            TeamMember assignee = members[rand.nextInt(members.length)];
            createChore(task, "Quick task", today.plusDays(offset), false, null, assignee);
        }
    }

    private void createChore(String title, String desc, LocalDate date, boolean recurring, String freq,
            TeamMember assignee) {
        Chore c = new Chore();
        c.title = title;
        c.description = desc;
        c.dueDate = date;
        c.isRecurring = recurring;
        c.recurrenceFrequency = freq;
        c.assignedTo = assignee;
        c.persist();
    }
}
