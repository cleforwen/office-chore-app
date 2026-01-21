package com.cleforwen;

import java.util.List;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/api/members")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TeamMemberResource {

    @GET
    public List<TeamMember> list() {
        return TeamMember.listAll();
    }

    @POST
    @Transactional
    public TeamMember add(TeamMember member) {
        member.persist();
        return member;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        TeamMember.deleteById(id);
    }
}
