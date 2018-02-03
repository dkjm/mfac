defmodule Mfac.Repo.Migrations.CreateTopicComment do
  use Ecto.Migration

  def change do
    create table(:topic_comments) do
      add :body, :text
      add :version, :integer
      add :parent_topic_coment_id, :integer
      add :topic_id, references(:topics, on_delete: :nothing)

      timestamps()
    end

    create index(:topic_comments, [:topic_id])
  end
end
