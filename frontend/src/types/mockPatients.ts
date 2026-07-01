export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  lastVisit: string;
}

export const MOCK_PATIENTS: Patient[] = [
  { id: "PT-001", name: "Juan Dela Cruz", age: 28, gender: "Male", phone: "0917-123-4567", email: "juan.dc@email.com", status: "Active", lastVisit: "2026-06-15" },
  { id: "PT-002", name: "Maria Clara Santos", age: 34, gender: "Female", phone: "0918-987-6543", email: "maria.cs@email.com", status: "Active", lastVisit: "2026-06-28" },
  { id: "PT-003", name: "Pedro Penduko", age: 45, gender: "Male", phone: "0922-555-1234", email: "pedro.p@email.com", status: "Inactive", lastVisit: "2025-12-01" },
  { id: "PT-004", name: "Jose Rizal", age: 35, gender: "Male", phone: "0917-111-2233", email: "jose.r@email.com", status: "Active", lastVisit: "2026-07-01" },
  { id: "PT-005", name: "Gabriela Silang", age: 42, gender: "Female", phone: "0918-222-3344", email: "gab.s@email.com", status: "Active", lastVisit: "2026-05-20" },
  { id: "PT-006", name: "Andres Bonifacio", age: 30, gender: "Male", phone: "0920-333-4455", email: "andres.b@email.com", status: "Inactive", lastVisit: "2026-01-15" },
  { id: "PT-007", name: "Teresa Magbanua", age: 50, gender: "Female", phone: "0919-444-5566", email: "teresa.m@email.com", status: "Active", lastVisit: "2026-06-10" },
  { id: "PT-008", name: "Antonio Luna", age: 33, gender: "Male", phone: "0921-555-6677", email: "antonio.l@email.com", status: "Active", lastVisit: "2026-04-12" },
  { id: "PT-009", name: "Melchora Aquino", age: 60, gender: "Female", phone: "0917-666-7788", email: "tandang.sora@email.com", status: "Inactive", lastVisit: "2025-11-30" },
  { id: "PT-010", name: "Emilio Aguinaldo", age: 55, gender: "Male", phone: "0918-777-8899", email: "emilio.a@email.com", status: "Active", lastVisit: "2026-02-14" },
  { id: "PT-011", name: "Dela Cruz, Ana", age: 22, gender: "Female", phone: "0920-888-9900", email: "ana.dc@email.com", status: "Active", lastVisit: "2026-06-25" },
  { id: "PT-012", name: "Santos, Roberto", age: 41, gender: "Male", phone: "0919-999-0011", email: "rob.santos@email.com", status: "Inactive", lastVisit: "2026-03-05" },
  { id: "PT-013", name: "Dela Cruz, Ben", age: 39, gender: "Male", phone: "0917-000-1122", email: "ben.dc@email.com", status: "Active", lastVisit: "2026-05-18" },
  { id: "PT-014", name: "Santos, Clarissa", age: 25, gender: "Female", phone: "0918-111-2233", email: "clar.s@email.com", status: "Active", lastVisit: "2026-06-29" },
  { id: "PT-015", name: "Gregoria de Jesus", age: 32, gender: "Female", phone: "0920-222-3344", email: "greg.dj@email.com", status: "Inactive", lastVisit: "2026-01-20" },
  { id: "PT-016", name: "Marcelo H. del Pilar", age: 44, gender: "Male", phone: "0919-333-4455", email: "marcelo.dp@email.com", status: "Active", lastVisit: "2026-04-01" },
  { id: "PT-017", name: "Apolinario Mabini", age: 36, gender: "Male", phone: "0917-444-5566", email: "apo.mabini@email.com", status: "Inactive", lastVisit: "2025-12-15" },
  { id: "PT-018", name: "Mariano Ponce", age: 29, gender: "Male", phone: "0918-555-6677", email: "mariano.p@email.com", status: "Active", lastVisit: "2026-06-05" },
  { id: "PT-019", name: "Paciano Rizal", age: 48, gender: "Male", phone: "0920-666-7788", email: "paciano.r@email.com", status: "Active", lastVisit: "2026-05-10" },
  { id: "PT-020", name: "Trinidad Tecson", age: 52, gender: "Female", phone: "0919-777-8899", email: "trin.tec@email.com", status: "Inactive", lastVisit: "2026-02-28" },
  { id: "PT-021", name: "Raja Sulayman", age: 33, gender: "Male", phone: "0917-888-9900", email: "raja.s@email.com", status: "Active", lastVisit: "2026-06-20" },
  { id: "PT-022", name: "Leonor Rivera", age: 24, gender: "Female", phone: "0918-999-0011", email: "leo.riv@email.com", status: "Active", lastVisit: "2026-05-30" },
  { id: "PT-023", name: "Dela Cruz, Carlos", age: 37, gender: "Male", phone: "0920-000-1122", email: "carl.dc@email.com", status: "Inactive", lastVisit: "2026-01-10" },
  { id: "PT-024", name: "Santos, Elena", age: 46, gender: "Female", phone: "0919-111-2233", email: "elen.s@email.com", status: "Active", lastVisit: "2026-04-15" },
  { id: "PT-025", name: "Francisco Baltazar", age: 58, gender: "Male", phone: "0917-222-3344", email: "fran.bal@email.com", status: "Inactive", lastVisit: "2025-12-25" },
  { id: "PT-026", name: "Dela Cruz, Maria", age: 27, gender: "Female", phone: "0918-333-4455", email: "maria.dc@email.com", status: "Active", lastVisit: "2026-06-12" },
  { id: "PT-027", name: "Santos, Jose", age: 31, gender: "Male", phone: "0920-444-5566", email: "jose.s@email.com", status: "Active", lastVisit: "2026-05-05" },
  { id: "PT-028", name: "Jose Abad Santos", age: 53, gender: "Male", phone: "0919-555-6677", email: "jose.as@email.com", status: "Inactive", lastVisit: "2026-03-20" },
  { id: "PT-029", name: "Dela Cruz, Luis", age: 40, gender: "Male", phone: "0917-666-7788", email: "luis.dc@email.com", status: "Active", lastVisit: "2026-06-01" },
  { id: "PT-030", name: "Santos, Ana", age: 35, gender: "Female", phone: "0918-777-8899", email: "ana.s@email.com", status: "Active", lastVisit: "2026-04-20" },
  { id: "PT-031", name: "Felix Resurreccion Hidalgo", age: 44, gender: "Male", phone: "0920-888-9900", email: "felix.res@email.com", status: "Inactive", lastVisit: "2026-01-05" },
  { id: "PT-032", name: "Dela Cruz, Paolo", age: 26, gender: "Male", phone: "0919-999-0011", email: "paolo.dc@email.com", status: "Active", lastVisit: "2026-06-18" },
  { id: "PT-033", name: "Santos, Victoria", age: 29, gender: "Female", phone: "0917-000-1122", email: "vic.s@email.com", status: "Active", lastVisit: "2026-05-25" },
  { id: "PT-034", name: "Juan Luna", age: 47, gender: "Male", phone: "0918-111-2233", email: "juan.lun@email.com", status: "Inactive", lastVisit: "2026-02-10" },
  { id: "PT-035", name: "Dela Cruz, Sofia", age: 33, gender: "Female", phone: "0920-222-3344", email: "sof.dc@email.com", status: "Active", lastVisit: "2026-06-02" },
  { id: "PT-036", name: "Santos, Miguel", age: 38, gender: "Male", phone: "0919-333-4455", email: "mig.s@email.com", status: "Active", lastVisit: "2026-04-28" },
  { id: "PT-037", name: "Marina Dizon", age: 41, gender: "Female", phone: "0917-444-5566", email: "marina.d@email.com", status: "Inactive", lastVisit: "2026-03-15" },
  { id: "PT-038", name: "Dela Cruz, Ricardo", age: 50, gender: "Male", phone: "0918-555-6677", email: "ric.dc@email.com", status: "Active", lastVisit: "2026-06-08" },
  { id: "PT-039", name: "Santos, Isabella", age: 22, gender: "Female", phone: "0920-666-7788", email: "isa.s@email.com", status: "Active", lastVisit: "2026-05-12" },
  { id: "PT-040", name: "Agueda Kahabagan", age: 55, gender: "Female", phone: "0919-777-8899", email: "agueda.k@email.com", status: "Inactive", lastVisit: "2026-02-05" },
  { id: "PT-041", name: "Dela Cruz, Gabriel", age: 29, gender: "Male", phone: "0917-888-9900", email: "gab.dc@email.com", status: "Active", lastVisit: "2026-06-22" },
  { id: "PT-042", name: "Santos, Diego", age: 34, gender: "Male", phone: "0918-999-0011", email: "diego.s@email.com", status: "Active", lastVisit: "2026-05-01" },
  { id: "PT-043", name: "Valeriano Abanilla", age: 43, gender: "Male", phone: "0920-000-1122", email: "val.aba@email.com", status: "Inactive", lastVisit: "2026-03-30" },
  { id: "PT-044", name: "Dela Cruz, Nina", age: 25, gender: "Female", phone: "0919-111-2233", email: "nina.dc@email.com", status: "Active", lastVisit: "2026-06-15" },
  { id: "PT-045", name: "Santos, Rafael", age: 36, gender: "Male", phone: "0917-222-3344", email: "raf.s@email.com", status: "Active", lastVisit: "2026-04-10" },
  { id: "PT-046", name: "Ines Villa", age: 40, gender: "Female", phone: "0918-333-4455", email: "ines.v@email.com", status: "Inactive", lastVisit: "2026-01-25" },
  { id: "PT-047", name: "Dela Cruz, Fernando", age: 48, gender: "Male", phone: "0920-444-5566", email: "fern.dc@email.com", status: "Active", lastVisit: "2026-05-15" },
  { id: "PT-048", name: "Santos, Lucia", age: 32, gender: "Female", phone: "0919-555-6677", email: "lucia.s@email.com", status: "Active", lastVisit: "2026-06-05" },
  { id: "PT-049", name: "Pio Valenzuela", age: 51, gender: "Male", phone: "0917-666-7788", email: "pio.val@email.com", status: "Inactive", lastVisit: "2026-02-12" },
  { id: "PT-050", name: "Dela Cruz, Isabel", age: 27, gender: "Female", phone: "0918-777-8899", email: "isabel.dc@email.com", status: "Active", lastVisit: "2026-06-25" }
];