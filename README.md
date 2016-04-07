# Guid
Create a new, random GUID.
```JavaScript
var guid = Guid.newGuid();
```
Create the empty/zero GUID.
```JavaScript
var guid = Guid.EMPTY;
guid.toString();
// "00000000-0000-0000-0000-000000000000"
```
Parse and create a GUID from a string.  The byte array is available for extended formatting.
```JavaScript
var guid = new Guid( 'CA761232-ED42-11CE-BACD-00AA0057B223' );
guid.toByteArray();
// ["ca", "76", "12", "32", "ed", "42", "11", "ce", "ba", "cd", "00", "aa", "00", "57", "b2", "23"]
```
Compare and sort GUIDs using `Guid.prototype.compareTo`, `Guid.prototype.equals`, and `Guid.comparator`.
```JavaScript
var guids = 
[
  'E6B1A81C-477D-4EA4-D4B4-E201CA245512',
  'a9ca2064-dd58-4a51-ad82-27a17bd5acaf',
  'AB86EA82-0221-4085-A49A-CB96BA6732BC'
];
var guidsSortedButUnmodified = guids.sort( Guid.comparator );
// ["a9ca2064-dd58-4a51-ad82-27a17bd5acaf", "AB86EA82-0221-4085-A49A-CB96BA6732BC", "E6B1A81C-477D-4EA4-D4B4-E201CA245512"]
```
