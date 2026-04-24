---
name: test-driven-development
description: 'Test-Driven Development: Write tests first for every requirement across any language, then implement minimal code, then refactor.'
---

# Test-Driven Development (TDD)

Simple, language-agnostic Test-Driven Development where **tests drive every implementation**.

**Core Principle:** Write failing tests FIRST → Implement minimal code SECOND → Refactor THIRD

---

## When to Use This Skill

- ✓ **Every new requirement and feature**
- ✓ Bug fixes and modifications
- ✓ Any programming language (JavaScript, Python, Java, Go, C#, Ruby, PHP, etc.)
- ✓ Any framework or technology
- ✓ AI-assisted development workflows

## When NOT to use

- ✗ Writing tests without implementation focus
- ✗ Tests running against live production systems
- ✗ Spike/exploration code (but convert to TDD immediately after)

---

## The TDD Cycle

Repeat this 3-step cycle for **every requirement**:

```
1. RED   → Write failing test (defines requirement)
2. GREEN → Write minimal code (passes the test)
3. REFACTOR → Improve code quality (keep tests passing)
```

**Time allocation:** 30% RED, 30% GREEN, 40% REFACTOR

---

# Phase 1: RED - Write Failing Tests

Write one test that **fails** because the feature doesn't exist yet.

## 1.1 Understand the Requirement

Before writing code, understand what needs to be tested:

1. **Happy path:** What should work normally?
2. **Edge cases:** Boundary conditions, empty inputs, null values
3. **Error cases:** Invalid inputs, missing data

**Example requirement:** "Users can create accounts with email"

Test scenarios:

- ✓ Should create user with valid email
- ✗ Should reject empty email
- ✗ Should reject invalid email format
- ✗ Should reject duplicate accounts

## 1.2 Write ONE Failing Test

Use **Arrange-Act-Assert** pattern:

```
ARRANGE: Set up test data/dependencies
ACT: Call the function/method
ASSERT: Check if result matches expectations
```

**Universal pseudocode:**

```
Test: should_X_when_Y
  ARRANGE: Setup data and dependencies
  ACT: Call function(data)
  ASSERT: Verify result equals expected_value
```

**JavaScript/TypeScript (Jest):**

```javascript
describe('UserService', () => {
  it('should_create_user_with_valid_email', () => {
    // ARRANGE
    const email = 'test@example.com';

    // ACT
    const user = createUser(email);

    // ASSERT
    expect(user.email).toBe(email);
    expect(user.id).toBeDefined();
  });
});
```

**Python (pytest):**

```python
def test_should_create_user_with_valid_email():
    # ARRANGE
    email = 'test@example.com'

    # ACT
    user = create_user(email)

    # ASSERT
    assert user.email == email
    assert user.id is not None
```

**Java (JUnit):**

```java
@Test
public void shouldCreateUserWithValidEmail() {
    String email = "test@example.com";
    User user = createUser(email);
    assertEquals(email, user.getEmail());
    assertNotNull(user.getId());
}
```

**Key points:**

- One behavior per test
- Clear test name: `should_X_when_Y`
- No implementation code yet
- Test MUST fail (function doesn't exist)

## 1.3 Verify Test Fails

Run the test - it **MUST fail**:

```bash
# JavaScript/TypeScript
npm test

# Python
pytest

# Java
mvn test

# Go
go test
```

**Checkpoint:** Test fails for the right reason (missing function), not syntax errors.

---

# Phase 2: GREEN - Write Minimal Code

Implement the **simplest code** that makes the test pass. No extra features.

## 2.1 Identify the Minimum Implementation

Ask yourself:

- What's the absolute minimum to pass this test?
- Can I hard-code values if the test is simple?
- What's the simplest data structure?
- Can I avoid design patterns for now?

## 2.2 Implementation Strategies

**Strategy 1: Hard-code if trivial**

```
If test expects: createUser("test@example.com")
Then implement: return { email: "test@example.com", id: "123" }
✓ Simple for simple tests
```

**Strategy 2: Direct implementation**

```
If test calls: sum(5, 3)
Then implement: function that adds two numbers
✓ Obvious solution
```

**Strategy 3: Simple data structure**

```
Don't create complex classes yet
Use plain objects/dictionaries
Avoid patterns/inheritance
✓ Defer architecture decisions
```

## 2.3 Write the Code

**Principle:** Only write what's needed for this one test.

**Example: Create user**

```javascript
// Test expects: user with email and id
function createUser(email) {
  return {
    email: email,
    Implement the **simplest code** that makes the test pass. No extra features.
  };
}
```

        return False
    return True

````

**Example: Calculate sum**
```java
public int sum(int a, int b) {
    return a + b;
}
````

## 2.4 Run Tests - Verify They Pass

```bash
npm test    # JavaScript
pytest      # Python
mvn test    # Java
go test     # Go
```

**All tests must pass.** If not, fix the code (not the test).

**Checkpoint:** Every test passes. Implementation is minimal.

---

# Phase 3: REFACTOR - Improve Code Quality

Now that tests pass, improve the code while keeping tests green.

## 3.1 Identify Quality Issues

Look for:

- **Duplication:** Same logic appears multiple times
- **Unclear names:** Variables/functions don't explain intent
- **Complexity:** Code is hard to read
- **Poor structure:** Mixed responsibilities

## 3.2 Refactor Techniques

### Extract duplicate code

```javascript
// Before
const total1 = prices.reduce((a, b) => a + b, 0);
const total2 = prices.reduce((a, b) => a + b, 0);

// After
const calculateTotal = () => prices.reduce((a, b) => a + b, 0);
const total1 = calculateTotal();
const total2 = calculateTotal();
```

### Rename for clarity

```javascript
// Before
const u = getUserById(id);
const proc = processPayment(u);

// After
const user = getUserById(id);
const processedPayment = processPayment(user);
```

### Extract methods

```javascript
// Before: Function does many things
function handleUser(data) {
  if (!data.email) throw new Error('Email required');
  database.save(user);
  email.send(user);
  return user;
}

// After: Focused functions
function validateUser(data) {
  if (!data.email) throw new Error('Email required');
}

function handleUser(data) {
  validateUser(data);
  const user = createUser(data);
  database.save(user);
  email.send(user);
  return user;
}
```

### Simplify logic

```javascript
// Before: Nested conditions
function isValid(user) {
  if (user) {
    if (user.email) {
      if (user.email.includes('@')) {
        return true;
      }
    }
  }
  return false;
}

// After: Guard clauses
function isValid(user) {
  if (!user || !user.email) return false;
  if (!user.email.includes('@')) return false;
  return true;
}
```

## 3.3 Run Tests After Each Change

After every refactoring:

```bash
npm test
```

If tests break:

- Revert the change immediately
- Apply smaller refactoring
- Try again

**Checkpoint:** All tests still pass after refactoring.

---

# Complete Example

## Requirement: Email Validation

### Step 1: RED - Write Failing Test

```javascript
describe('EmailValidator', () => {
  it('should_accept_valid_email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('should_reject_empty_email', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should_reject_missing_domain', () => {
    expect(isValidEmail('test@')).toBe(false);
  });
});
```

**Run:** ❌ All tests fail (function doesn't exist)

### Step 2: GREEN - Write Minimal Code

```javascript
function isValidEmail(email) {
  if (!email) return false;
  if (!email.includes('@')) return false;
  const [, domain] = email.split('@');
  if (!domain) return false;
  return true;
}
```

```javascript
function isValidEmail(email) {
  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [username, domain] = parts;
  return username.length > 0 && domain.length > 0;
}
```

**Run:** ✅ All tests still pass (refactoring complete)

---

# Workflow For Multiple Requirements

Repeat the RED-GREEN-REFACTOR cycle for each requirement:

```
REQUIREMENT 1 (user can create account)
├─ RED: Write test for registration
├─ GREEN: Implement registration function
└─ REFACTOR: Clean up code

REQUIREMENT 2 (email must be unique)
├─ RED: Write test for duplicate check
├─ GREEN: Add duplicate validation
└─ REFACTOR: Extract validation logic

REQUIREMENT 3 (send confirmation email)
├─ RED: Write test for email sending
├─ GREEN: Add email integration
└─ REFACTOR: Extract email service

FEATURE COMPLETE
└─ Final refactor: Remove all duplication
```

---

# AI-Driven TDD Workflow

For AI agents implementing features:

## 1. Understand Requirements (Human)

Provide clear requirements:

- What should it do?
- What's the expected input/output?
- What edge cases matter?

## 2. Generate Tests (AI)

- Write tests that FAIL
- One behavior per test
- Use Arrange-Act-Assert pattern
- Include happy path + edge cases

- Minimal implementation
- Make tests pass
- Run tests to verify

## 4. Refactor (AI)

- Remove duplication
- Improve names
- Simplify logic
- Keep tests green

## 5. Verify (AI)

- All tests pass
- Coverage adequate (80%+ line)
- Code is clean

---

# Best Practices

**TDD Discipline:**

- ✓ Enforce strict RED-GREEN-REFACTOR discipline
- ✓ Each phase must be completed before moving to next
- ✓ Tests are the specification
- ✓ If a test is hard to write, the design needs improvement
- ✓ Keep test execution fast
- ✓ Tests should be independent and isolated

**Code Quality:**

- ✓ Write meaningful test names that document intent
- ✓ Keep one behavior per test
- ✓ Avoid brittle tests coupled to implementation details
- ✓ Commit frequently after successful tests
- ✓ Use version control for safe experimentation

## Deterministic Testing Rules

Tests must be deterministic, maintainable, and clearly express intent:

- **No Logic in Test Blocks:** Using `if`, `else`, `switch`, or loops (with internal logic) within a test is prohibited. Tests should follow a single, linear execution path without branching.
- **Linear Flow:** Each test must execute exactly one code path. Use separate test cases or parametrization to cover different logic branches in your code.
- **AAA Pattern:** All tests must clearly separate:
  - **Arrange** (setup test data and dependencies)
  - **Act** (execute the function/behavior being tested)
  - **Assert** (verify the expected result)

- **Intent-Driven Naming:** Tests should describe what the component/service does, not how it's implemented. Test names should be readable as specifications.

**Example of deterministic test:**

```javascript
// ✓ GOOD: Deterministic, clear intent
describe('calculateDiscount', () => {
  it('should_apply_10_percent_discount_for_premium_members', () => {
    // Arrange
    const member = { type: 'premium', purchaseAmount: 100 };

    // Act
    const discount = calculateDiscount(member);

    // Assert
    expect(discount).toBe(10);
  });
});

// ✗ BAD: Contains logic in test
describe('calculateDiscount', () => {
  it('should_apply_discount_based_on_member_type', () => {
    const memberTypes = ['premium', 'standard', 'basic'];

    memberTypes.forEach((type) => {
      const member = { type };
      const discount = calculateDiscount(member);

      if (type === 'premium') {
        expect(discount).toBe(10);
      } else if (type === 'standard') {
        expect(discount).toBe(5);
      } else {
        expect(discount).toBe(0);
      }
    });
  });
});

// ✓ BETTER: Separate deterministic tests
describe('calculateDiscount', () => {
  it('should_apply_10_percent_discount_for_premium_members', () => {
    const discount = calculateDiscount({ type: 'premium' });
    expect(discount).toBe(10);
  });

  it('should_apply_5_percent_discount_for_standard_members', () => {
    const discount = calculateDiscount({ type: 'standard' });
    expect(discount).toBe(5);
  });

  it('should_apply_no_discount_for_basic_members', () => {
    const discount = calculateDiscount({ type: 'basic' });
    expect(discount).toBe(0);
  });
});
```

## Anti-Patterns to Avoid

- ✗ Modifying tests to make them pass
- ✗ Ignoring failing tests
- ✗ Complex abstractions without test justification

---

# Validation Checkpoints

## RED Phase Validation

- [ ] Tests are isolated and can run independently

## GREEN Phase Validation

- [ ] Implementation is truly minimal

## REFACTOR Phase Validation

Before committing refactored code:

- [ ] All tests still pass after refactoring
- [ ] Code complexity reduced or maintained
- [ ] Code follows design patterns appropriately
- [ ] SOLID principles applied

## Coverage Metrics to Track

- Branch coverage: % of conditional branches tested
- Function coverage: % of functions tested
- Test count: Total number of tests
- Execution time: Total time for test suite
- Coverage per module: Break down by component

**Quality Metrics:**

- Defect escape rate: Bugs found after implementation

**TDD Metrics:**

- Time in each phase (Red/Green/Refactor)
- Number of test-implementation cycles
- Coverage progression over time
- Refactoring frequency
- Technical debt created and resolved

## Coverage Report Generation

```bash
# JavaScript/TypeScript
npm run test:coverage
# Go
go test -cover ./...

**Interpret Coverage:**

- < 70%: Significant gaps, add more tests

---



1. **STOP** immediately
2. Identify which phase was violated
3. Rollback to last valid state
4. Resume from correct phase
5. Document lesson learned

**Violation Scenarios:**

**Scenario 1: Implementation before tests**

```

1. Identify rogue code written before tests
2. Revert to last test-driven commit
3. Write tests first
4. Implement again using TDD
5. Document why this happened

```

**Scenario 2: Test passes by accident**

```

1. Verify test actually passes (not failure message)
2. Consider if implementation already existed
3. If accidental pass, modify test to fail
4. Implement to make real test pass

```

**Scenario 3: Broken tests during refactoring**

```

1. Immediately revert refactoring
2. Verify tests pass again
3. Apply smaller, more focused refactoring
4. Re-run tests
5. Commit successful refactoring

````

---

# Complete Implementation Examples

## Example 1: User Service (TypeScript)

**RED Phase: Write Tests**

```typescript
describe('UserService', () => {
  let service: UserService;

  it('should_create_user_with_email_and_name', async () => {
    const result = await service.create({
      email: 'test@test.com',
      name: 'Test',
    });
    expect(result.id).toBeDefined();
    expect(result.email).toBe('test@test.com');
    expect(result.name).toBe('Test');
  });

  it('should_find_user_by_email', async () => {
    await service.create({ email: 'test@test.com', name: 'Test' });
    const user = await service.findByEmail('test@test.com');
    expect(user).toBeDefined();
    expect(user?.email).toBe('test@test.com');
  });

    const user = await service.findByEmail('nonexistent@test.com');
    expect(user).toBeNull();
  });
});
````

**GREEN Phase: Minimal Implementation**

```typescript
class UserService {
  private users: Map<string, any> = new Map();
  private nextId = 1;

  async create(data: { email: string; name: string }) {
    const user = { id: String(this.nextId++), ...data };
    this.users.set(user.email, user);
    return user;
  }

  async findByEmail(email: string) {
    return this.users.get(email) || null;
}
```

_All tests pass. Minimal in-memory implementation. Technical debt: no database, no validation._

**REFACTOR Phase: Production-Ready**

```typescript
class UserService {
  constructor(private db: Database) {}

  async create(data: CreateUserDto): Promise<User> {
    this.validateEmail(data.email);
    const existing = await this.db.findOne('users', { email: data.email });
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const user = { id: uuid(), ...data, createdAt: new Date() };
    await this.db.insert('users', user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.findOne('users', { email });
  }

  private validateEmail(email: string): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
    }
  }
}
```

_Database integration, validation, error handling, better structure._

## Example 2: Product API (Express.js)

**RED Phase: Tests**

```javascript
describe('Product API', () => {
  it('should_create_product_and_return_201', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Widget', price: 9.99 });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Widget');
  });

  it('should_list_all_products', async () => {
    await request(app)
      .post('/api/products')
      .send({ name: 'Widget', price: 9.99 });

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
```

**GREEN Phase: Minimal Implementation**

```javascript
let products = [];
let nextId = 1;

app.post('/api/products', (req, res) => {
  const product = { id: nextId++, ...req.body };
  products.push(product);
  res.status(201).json(product);
});
app.get('/api/products', (req, res) => {
  res.json(products);
});
```

// Controller
async create(req, res) {
try {
const product = await productService.create(req.body);
res.status(201).json(product);
} catch (error) {
res.status(400).json({ error: error.message });
}
}

async list(req, res) {
const products = await productService.findAll();
res.json(products);
}
}
// Service
class ProductService {
async create(data) {
this.validate(data);
return productRepository.save(data);
}
private validate(data) {
if (data.price < 0) throw new Error('Price must be positive');
}
}

````

---

# Modern Practices and Advanced Topics

## Type-Driven Development

Let types guide implementation:

```typescript
// Types define contracts
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

// Tests verify contract compliance
describe('UserRepository Contract', () => {
  it('should_find_user_by_id', async () => {
    const user = { id: '1', name: 'Test' };
    await repository.save(user);

    const found = await repository.findById('1');
    expect(found).toEqual(user);
  });
});

// Green phase: In-memory implementation
class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

// Refactor phase: Database implementation (same interface)
class DatabaseUserRepository implements UserRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<User | null> {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }

  async save(user: User): Promise<void> {
    await this.db.insert('users', user);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete('users', { id });
  }
}
````

## AI-Assisted TDD

**Using GitHub Copilot or other AI tools:**

1. **Write test first** (human-driven)
2. **Let AI suggest minimal implementation**
3. **Verify suggestion passes tests**
4. **Accept if truly minimal**, reject if over-engineered
5. **Iterate with AI for refactoring phase**

**Effective AI Prompt:**

```
Given these failing tests:
[paste tests]

Provide the MINIMAL implementation that makes tests pass.
- Do not add error handling, validation, or features beyond test requirements
- Focus on simplicity over completeness
- Keep implementation to < 20 lines if possible
```

## Cloud-Native Testing

**Local Development → Containerized → Cloud:**

```javascript
// Green Phase: Local implementation
class CacheService {
  private cache = new Map();
  get(key) { return this.cache.get(key); }
  set(key, value) { this.cache.set(key, value); }
}

// Refactor: Redis-compatible interface
class CacheService {
  constructor(private redis) {}
  async get(key) { return this.redis.get(key); }
  async set(key, value) { return this.redis.set(key, value); }
}

// Production: Distributed cache with fallback
class CacheService {
  constructor(private redis, private fallback) {}
  async get(key) {
    try {
      return await this.redis.get(key);
    } catch {
      return this.fallback.get(key);
    }
  }
}
```

## Observability-Driven Development

**Add observability gradually:**

```typescript
// Green Phase: Simple logging
class OrderService {
  async createOrder(data: CreateOrderDto): Promise<Order> {
    console.log('[OrderService] Creating order', { data });
    const order = { id: '123', ...data };
    console.log('[OrderService] Order created', { orderId: order.id });
    return order;
  }
}

// Refactor Phase: Structured logging
class OrderService {
  constructor(private logger: Logger) {}

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const startTime = Date.now();
    this.logger.info('order.create.start', { data });

    const order = await this.repository.save(data);

    this.logger.info('order.create.success', {
      orderId: order.id,
      duration: Date.now() - startTime,
    });

    return order;
  }
}
```

---

# Success Criteria

**TDD Implementation is Successful When:**

- ✓ 100% of code written test-first
- ✓ All tests pass continuously
- ✓ Coverage exceeds thresholds (80% line, 75% branch)
- ✓ Code complexity within limits (cyclomatic complexity < 10)
- ✓ Zero defects in covered code
- ✓ Clear test documentation
- ✓ Fast test execution (< 5 seconds for unit tests)
- ✓ Team follows TDD discipline consistently
- ✓ Technical debt tracked and managed
- ✓ Code reviews verify TDD process was followed

---

# Summary

Test-Driven Development is a discipline that improves code quality through:

1. **Testing First** - Tests define requirements
2. **Small Steps** - Red-Green-Refactor cycles
3. **Constant Feedback** - Tests validate progress
4. **Quality Focus** - Refactoring improves design
5. **Documentation** - Tests document behavior

**Remember:** Make it fail, make it pass, make it better.

---

# Success Indicators

Your TDD practice is working when:

- ✓ Tests pass on first run
- ✓ You find bugs before production
- ✓ Refactoring feels safe
- ✓ Code is easy to understand
- ✓ New features integrate smoothly
- ✓ Tests serve as documentation
- ✓ Team has confidence in changes
