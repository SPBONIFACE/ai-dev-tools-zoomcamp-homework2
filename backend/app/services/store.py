from datetime import datetime, timezone
import uuid
from typing import List, Optional, Dict
from app.models.schemas import (
    PartyResponse,
    PartyStatus,
    TableResponse,
    TableStatus,
    NotificationLogResponse,
    PartyCreate,
    AnalyticsSummaryResponse,
    NotifyPartyResponse,
)


class InMemoryStore:
    def __init__(self):
        self.reset()

    def reset(self):
        now = datetime.now(timezone.utc)
        self.parties: Dict[str, PartyResponse] = {
            "p-101": PartyResponse(
                id="p-101",
                guest_name="Elena Rostova",
                party_size=2,
                phone_number="+1 (555) 014-2201",
                notes="Window booth preferred. Quiet table.",
                quoted_wait_min=15,
                status=PartyStatus.WAITING,
                table_id=None,
                created_at=now,
            ),
            "p-102": PartyResponse(
                id="p-102",
                guest_name="Marcus Vance",
                party_size=4,
                phone_number="+1 (555) 018-8832",
                notes="Needs 1 high chair.",
                quoted_wait_min=30,
                status=PartyStatus.WAITING,
                table_id=None,
                created_at=now,
            ),
            "p-103": PartyResponse(
                id="p-103",
                guest_name="Sarah Jenkins",
                party_size=6,
                phone_number="+1 (555) 019-9941",
                notes="Birthday celebration.",
                quoted_wait_min=40,
                status=PartyStatus.NOTIFIED,
                table_id=None,
                created_at=now,
                notified_at=now,
            ),
        }

        self.tables: Dict[str, TableResponse] = {
            "T1": TableResponse(id="T1", name="Table 1", capacity=2, status=TableStatus.AVAILABLE),
            "T2": TableResponse(id="T2", name="Table 2", capacity=2, status=TableStatus.AVAILABLE),
            "T3": TableResponse(id="T3", name="Table 3", capacity=4, status=TableStatus.AVAILABLE),
            "T4": TableResponse(id="T4", name="Table 4", capacity=4, status=TableStatus.AVAILABLE),
            "T5": TableResponse(id="T5", name="Table 5", capacity=6, status=TableStatus.AVAILABLE),
            "T6": TableResponse(id="T6", name="Table 6", capacity=6, status=TableStatus.AVAILABLE),
        }

        self.notifications: List[NotificationLogResponse] = [
            NotificationLogResponse(
                id="notif-1",
                party_id="p-103",
                phone_number="+1 (555) 019-9941",
                message="TableHop: Your table is ready! Please report to the host stand within 5 minutes.",
                sent_at=now,
            )
        ]

    # --- Waitlist Methods ---
    def get_parties(self, status: Optional[PartyStatus] = None) -> List[PartyResponse]:
        parties = list(self.parties.values())
        if status:
            return [p for p in parties if p.status == status]
        return parties

    def get_party(self, party_id: str) -> Optional[PartyResponse]:
        return self.parties.get(party_id)

    def add_party(self, data: PartyCreate) -> PartyResponse:
        now = datetime.now(timezone.utc)
        active_waiting = len([
            p for p in self.parties.values()
            if p.status in (PartyStatus.WAITING, PartyStatus.NOTIFIED)
        ])
        auto_wait = (active_waiting + 1) * 10
        quoted_wait = data.quoted_wait_min if data.quoted_wait_min is not None else auto_wait

        party = PartyResponse(
            id=f"p-{uuid.uuid4().hex[:8]}",
            guest_name=data.guest_name,
            party_size=data.party_size,
            phone_number=data.phone_number,
            notes=data.notes,
            quoted_wait_min=quoted_wait,
            status=PartyStatus.WAITING,
            table_id=None,
            created_at=now,
        )
        self.parties[party.id] = party
        return party

    def update_party_status(self, party_id: str, status: PartyStatus) -> Optional[PartyResponse]:
        party = self.parties.get(party_id)
        if not party:
            return None
        now = datetime.now(timezone.utc)
        notified_at = now if status == PartyStatus.NOTIFIED else party.notified_at
        seated_at = now if status == PartyStatus.SEATED else party.seated_at

        updated = party.model_copy(
            update={"status": status, "notified_at": notified_at, "seated_at": seated_at}
        )
        self.parties[party_id] = updated
        return updated

    def cancel_party(self, party_id: str) -> Optional[PartyResponse]:
        party = self.parties.get(party_id)
        if not party:
            return None
        # If party occupied a table, free it
        if party.table_id and party.table_id in self.tables:
            table = self.tables[party.table_id]
            self.tables[party.table_id] = table.model_copy(
                update={"status": TableStatus.AVAILABLE, "current_party_id": None}
            )

        updated = party.model_copy(update={"status": PartyStatus.CANCELLED, "table_id": None})
        self.parties[party_id] = updated
        return updated

    # --- Table Methods ---
    def get_tables(self) -> List[TableResponse]:
        return list(self.tables.values())

    def seat_party(self, table_id: str, party_id: str) -> TableResponse:
        table = self.tables.get(table_id)
        if not table:
            raise KeyError("Table not found")
        if table.status == TableStatus.OCCUPIED:
            raise ValueError("Table is already occupied")

        party = self.parties.get(party_id)
        if not party:
            raise KeyError("Party not found")

        now = datetime.now(timezone.utc)
        # Update table
        updated_table = table.model_copy(
            update={"status": TableStatus.OCCUPIED, "current_party_id": party_id}
        )
        self.tables[table_id] = updated_table

        # Update party
        updated_party = party.model_copy(
            update={"status": PartyStatus.SEATED, "table_id": table_id, "seated_at": now}
        )
        self.parties[party_id] = updated_party

        return updated_table

    def clear_table(self, table_id: str) -> TableResponse:
        table = self.tables.get(table_id)
        if not table:
            raise KeyError("Table not found")

        # Free table
        updated_table = table.model_copy(
            update={"status": TableStatus.AVAILABLE, "current_party_id": None}
        )
        self.tables[table_id] = updated_table
        return updated_table

    # --- Notification & Analytics Methods ---
    def notify_party(self, party_id: str) -> NotifyPartyResponse:
        party = self.parties.get(party_id)
        if not party:
            raise KeyError("Party not found")

        now = datetime.now(timezone.utc)
        updated_party = party.model_copy(
            update={"status": PartyStatus.NOTIFIED, "notified_at": now}
        )
        self.parties[party_id] = updated_party

        notif = NotificationLogResponse(
            id=f"notif-{uuid.uuid4().hex[:8]}",
            party_id=party.id,
            phone_number=party.phone_number,
            message=f"TableHop: Your table is ready for {party.guest_name}! Please proceed to the host stand.",
            sent_at=now,
        )
        self.notifications.insert(0, notif)
        return NotifyPartyResponse(party=updated_party, notification=notif)

    def get_notifications(self) -> List[NotificationLogResponse]:
        return list(self.notifications)

    def get_analytics_summary(self) -> AnalyticsSummaryResponse:
        active_waiting = [
            p for p in self.parties.values()
            if p.status in (PartyStatus.WAITING, PartyStatus.NOTIFIED)
        ]
        total_seated = len([
            p for p in self.parties.values()
            if p.status == PartyStatus.SEATED
        ])
        avg_wait = (
            round(sum(p.quoted_wait_min for p in active_waiting) / len(active_waiting))
            if active_waiting
            else 0
        )
        return AnalyticsSummaryResponse(
            active_waiting=len(active_waiting),
            avg_wait_min=avg_wait,
            total_seated_today=total_seated,
        )

store = InMemoryStore()


