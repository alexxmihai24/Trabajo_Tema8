export const users = [
    {
        id: "0933a07d-a832-4602-b34c-dc16c0a32b5b",
        email: "test@google.com",
        password: "$2y$10$N9jvCspHhC8m6xUrozW6O.zgzSlRs38/xPSjde63KyJrr3Vk8NnyO",
        fullName: "Admin Tester",
        isActive: true,
        roles: ["admin"]
    },
    {
        id: "80ba6e8b-599f-4fbb-83fa-403cc2b92f6e",
        email: "test1@google.com",
        password: "$2a$10$5/2xowOA/JQL4820gXezKuN9MYW2H1HU7lAGMl87KTuioOr2weOi.",
        fullName: "Juan Carlos",
        isActive: true,
        roles: ["admin"]
    }
];

export const events = [
    {
        id: "0879090c-5488-48ee-b727-7f189492a4ce",
        title: "Concierto Rock en Vivo",
        description: "El mejor concierto de rock del año con bandas internacionales y locales.",
        date: new Date("2026-08-15T20:00:00Z"),
        location: "Estadio Santiago Bernabéu, Madrid",
        price: 75.50,
        slug: "concierto_rock_en_vivo_2026",
        capacity: 50000,
        userId: "80ba6e8b-599f-4fbb-83fa-403cc2b92f6e"
    },
    {
        id: "0a41a65d-1c79-4f53-869d-c3711b164c58",
        title: "Feria de Tecnología AI",
        description: "Feria anual para ver los avances en inteligencia artificial, robótica y desarrollo.",
        date: new Date("2026-10-01T09:00:00Z"),
        location: "IFEMA, Madrid",
        price: 25.00,
        slug: "feria_tecnologia_ai_2026",
        capacity: 10000,
        userId: "80ba6e8b-599f-4fbb-83fa-403cc2b92f6e"
    }
];

export const eventImages = [
    {
        url: "concierto_rock_front",
        eventId: "0879090c-5488-48ee-b727-7f189492a4ce"
    },
    {
        url: "feria_ai_poster",
        eventId: "0a41a65d-1c79-4f53-869d-c3711b164c58"
    }
];
