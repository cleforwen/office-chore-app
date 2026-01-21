package com.cleforwen;

import java.util.List;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/api/chores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ChoreResource {

    @jakarta.inject.Inject
    ChoreService choreService;

    @GET
    public List<Chore> list() {
        return choreService.getAllChoresWithRecurrences();
    }

    @POST
    @Transactional
    public Chore add(Chore chore) {
        if (chore.assignedTo != null && chore.assignedTo.id != null) {
            chore.assignedTo = TeamMember.findById(chore.assignedTo.id);
        }
        chore.persist();
        return chore;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Chore update(@PathParam("id") Long id, Chore chore) {
        Chore entity = Chore.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }
        entity.title = chore.title;
        entity.description = chore.description;
        entity.dueDate = chore.dueDate;
        entity.isRecurring = chore.isRecurring;
        entity.recurrenceFrequency = chore.recurrenceFrequency;
        if (chore.assignedTo != null && chore.assignedTo.id != null) {
            entity.assignedTo = TeamMember.findById(chore.assignedTo.id);
        } else {
            entity.assignedTo = null;
        }
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Chore.deleteById(id);
    }
}
