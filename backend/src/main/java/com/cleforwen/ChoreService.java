package com.cleforwen;

import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class ChoreService {

    public List<Chore> getAllChoresWithRecurrences() {
        List<Chore> allChores = Chore.listAll();
        List<Chore> expandedChores = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDate threeMonthsOut = today.plusMonths(9); // Expanding a bit further for safety

        for (Chore chore : allChores) {
            // Always add the original
            expandedChores.add(chore);

            if (chore.isRecurring && chore.dueDate != null && chore.recurrenceFrequency != null) {
                LocalDate nextDate = chore.dueDate;

                // Advance nextDate until it's after the original due date
                while (!nextDate.isAfter(threeMonthsOut)) {
                    switch (chore.recurrenceFrequency) {
                        case "DAILY":
                            nextDate = nextDate.plusDays(1);
                            break;
                        case "WEEKLY":
                            nextDate = nextDate.plusWeeks(1);
                            break;
                        case "MONTHLY":
                            nextDate = nextDate.plusMonths(1);
                            break;
                        default:
                            nextDate = threeMonthsOut.plusDays(1); // Break loop
                    }

                    if (nextDate.isAfter(threeMonthsOut))
                        break;

                    // Create virtual copy
                    Chore virtualChore = new Chore();
                    virtualChore.id = chore.id;
                    virtualChore.title = chore.title;
                    virtualChore.description = chore.description;
                    virtualChore.assignedTo = chore.assignedTo;
                    virtualChore.isRecurring = true;
                    virtualChore.recurrenceFrequency = chore.recurrenceFrequency;
                    virtualChore.dueDate = nextDate;

                    expandedChores.add(virtualChore);
                }
            }
        }
        return expandedChores;
    }
}
