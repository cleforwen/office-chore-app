package com.cleforwen;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class ChoreResourceTest {

        @Test
        public void testCreateChore() {
                Chore chore = new Chore();
                chore.title = "Test Chore";
                chore.description = "Testing persistence";
                chore.dueDate = LocalDate.now();
                chore.isRecurring = false;

                given()
                                .contentType(ContentType.JSON)
                                .body(chore)
                                .when().post("/api/chores")
                                .then()
                                .statusCode(200)
                                .body("id", notNullValue());
        }

        @Test
        public void testCreateChoreWithMember() {
                // Create member first
                TeamMember member = new TeamMember();
                member.name = "Test User";

                // We need to persist member. mocking or using resource
                // Since we are in @QuarkusTest, we can use the entity directly but need
                // transaction
                // But simpler to use the API to create member

                Integer memberId = given()
                                .contentType(ContentType.JSON)
                                .body(member)
                                .when().post("/api/members")
                                .then().statusCode(200)
                                .extract().path("id");

                String json = "{\n" +
                                "  \"title\": \"Test Chore\",\n" +
                                "  \"dueDate\": \"2024-01-21\",\n" +
                                "  \"isRecurring\": false,\n" +
                                "  \"assignedTo\": { \"id\": " + memberId + " }\n" +
                                "}";

                given()
                                .contentType(ContentType.JSON)
                                .body(json)
                                .when().post("/api/chores")
                                .then()
                                .statusCode(200)
                                .body("id", notNullValue());
        }
}
