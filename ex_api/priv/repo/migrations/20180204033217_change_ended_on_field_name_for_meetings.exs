defmodule Mfac.Repo.Migrations.ChangeEndedOnFieldNameForMeetings do
  use Ecto.Migration

  def change do
  	rename table(:meetings), :ended_on, to: :ended_at
  end
end
