# Van Life

Host-listed vans, occupancy, and how a listing is shown to renters.

## Language

**VanState**:
The host-set listing lifecycle of a van: Available, In repair, or On sale. Stored on the van. Not occupancy and not newness.
_Avoid_: status, availability, lowercase state, NEW

**Occupancy**:
Whether the van has an open rent. The source of truth is a rent whose end time is absent.
_Avoid_: available, Available, VanState

**Claim lock**:
A denormalized flag on the van used to serialize rent claims. It can drift from occupancy.
_Avoid_: occupancy, available

**Newness**:
Whether the listing is younger than six months. Derived from created time at read. Not a VanState.
_Avoid_: NEW as stored state, overlay that beats On sale or In repair

**Rentable**:
A van with no occupancy and not In repair. An On sale listing can be rentable.
_Avoid_: available, Available

**Listing chrome**:
The single card border and wash. Priority: In repair, then On sale, then Newness, then none.
_Avoid_: stacking every fact into one badge
