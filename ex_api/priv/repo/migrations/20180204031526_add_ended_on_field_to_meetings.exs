defmodule Mfac.Repo.Migrations.AddEndedOnFieldToMeetings do
  use Ecto.Migration

  def change do
  	alter table(:meetings) do
  		add :ended_on, :utc_datetime
  	end
  end
end
