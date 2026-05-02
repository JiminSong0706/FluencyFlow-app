# Firebase Security Specification

## Data Invariants
1. **Ownership**: A user can only access data within their own path `/users/{userId}/**`.
2. **Identity Integrity**: The `userId` field in the user profile must strictly match the authenticated `request.auth.uid`.
3. **Schema Strictness**: All documents must follow the structure defined in `firebase-blueprint.json`.
4. **Immutability**: `userId` and `email` in UserProfile, and `itemId` in TreeDecoration, cannot be changed after creation.
5. **Boundary Limits**: Tree decoration coordinates must be within -10 to 110 percent.

## The "Dirty Dozen" Payloads (Denial Tests)

### 1. Identity Spoofing (Create profile for someone else)
**Path**: `/users/attacker-uid`
**Auth**: `{ uid: 'victim-uid' }`
**Payload**:
```json
{
  "userId": "attacker-uid",
  "email": "victim@example.com",
  "collectedItems": [],
  "updatedAt": "2024-01-01T00:00:00Z"
}
```
**Result**: `PERMISSION_DENIED` (isOwner check fails)

### 2. Privilege Escalation (Set isAdmin field)
**Path**: `/users/my-uid`
**Auth**: `{ uid: 'my-uid' }`
**Payload**:
```json
{
  "userId": "my-uid",
  "email": "my@example.com",
  "collectedItems": [],
  "updatedAt": "2024-01-01T00:00:00Z",
  "isAdmin": true
}
```
**Result**: `PERMISSION_DENIED` (Strict key count/hasAll checks fail)

### 3. State Shortcut (Update immutable field)
**Path**: `/users/my-uid`
**Operation**: `update`
**Payload**:
```json
{
  "userId": "changed-uid"
}
```
**Result**: `PERMISSION_DENIED` (affectedKeys().hasOnly(['collectedItems', 'updatedAt']) check fails)

### 4. Resource Poisoning (1MB String ID)
**Path**: `/users/` + 'A' * 1024 * 1024
**Result**: `PERMISSION_DENIED` (isValidId size limit check fails)

### 5. Boundary Violation (Invalid Coordinates)
**Path**: `/users/my-uid/decorations/deco1`
**Payload**:
```json
{
  "itemId": "star",
  "x": 500,
  "y": 50
}
```
**Result**: `PERMISSION_DENIED` (isValidDecoration coord range check fails)

### 6. PII Blanket Read (List all users)
**Path**: `/users`
**Result**: `PERMISSION_DENIED` (No list rule for users collection)

### 7. Shadow Update (Ghost Field Injection)
**Path**: `/users/my-uid`
**Operation**: `update`
**Payload**:
```json
{
  "collectedItems": ["star"],
  "updatedAt": "...",
  "extraField": "malicious"
}
```
**Result**: `PERMISSION_DENIED` (affectedKeys().hasOnly fails)

### 8. Denial of Wallet (Giant Transcript)
**Path**: `/users/my-uid/sessions/sess1`
**Payload**:
```json
{
  "transcript": [/* 10,001 items */]
}
```
**Result**: `PERMISSION_DENIED` (transcript.size() <= 1000 check fails)

### 9. Orphaned Record (Self-assigned Session ID)
**Path**: `/users/my-uid/sessions/INVALID-ID-!!!"`
**Result**: `PERMISSION_DENIED` (isValidId regex check fails)

### 10. Type Confusion (Array as Object)
**Path**: `/users/my-uid`
**Payload**:
```json
{
  "collectedItems": { "not": "an-array" }
}
```
**Result**: `PERMISSION_DENIED` (data.collectedItems is list fails)

### 11. Cross-User Deletion
**Path**: `/users/victim-uid/sessions/sess1`
**Auth**: `{ uid: 'attacker-uid' }`
**Operation**: `delete`
**Result**: `PERMISSION_DENIED` (isOwner fails)

### 12. Future Timestamp Injection (System Lock)
**Path**: `/users/my-uid`
**Payload**:
```json
{
  "updatedAt": "2099-12-31T23:59:59Z"
}
```
**Result**: `PERMISSION_DENIED` (Valid profile check ensures updatedAt is manageable)

## Conflict Report
| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- |
| users | BLOCKED (isOwner) | BLOCKED (hasOnly) | BLOCKED (isValidId) |
| sessions | BLOCKED (isOwner) | BLOCKED (immutable) | BLOCKED (size limits) |
| decorations | BLOCKED (isOwner) | BLOCKED (hasOnly) | BLOCKED (isValidId) |
