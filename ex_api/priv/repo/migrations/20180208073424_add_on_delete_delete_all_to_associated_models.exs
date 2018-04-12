defmodule Mfac.Repo.Migrations.AddOnDeleteDeleteAllToAssociatedModels do
  use Ecto.Migration

  def change do
  
    alter table(:invitations) do
  		remove :meeting_id
  		add :meeting_id, references(:meetings, on_delete: :delete_all)
    end

    alter table(:participants) do
  		remove :meeting_id
  		add :meeting_id, references(:meetings, on_delete: :delete_all)
    end

    alter table(:agenda_items) do
  		remove :meeting_id
  		add :meeting_id, references(:meetings, on_delete: :delete_all)
    end

    alter table(:agenda_item_votes) do
  		remove :agenda_item_id
  		add :agenda_item_id, references(:agenda_items, on_delete: :delete_all)
    end

    alter table(:stack_entries) do
  		remove :agenda_item_id
  		add :agenda_item_id, references(:agenda_items, on_delete: :delete_all)
    end


  end
end
