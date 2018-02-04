defmodule MfacWeb.AgendaItemVoteControllerTest do
  use MfacWeb.ConnCase

  alias Mfac.Meetings
  alias Mfac.Meetings.AgendaItemVote

  @create_attrs %{version: 42, vote_type: "some vote_type"}
  @update_attrs %{version: 43, vote_type: "some updated vote_type"}
  @invalid_attrs %{version: nil, vote_type: nil}

  def fixture(:agenda_item_vote) do
    {:ok, agenda_item_vote} = Meetings.create_agenda_item_vote(@create_attrs)
    agenda_item_vote
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all agendaitemvotes", %{conn: conn} do
      conn = get conn, agenda_item_vote_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create agenda_item_vote" do
    test "renders agenda_item_vote when data is valid", %{conn: conn} do
      conn = post conn, agenda_item_vote_path(conn, :create), agenda_item_vote: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, agenda_item_vote_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "version" => 42,
        "vote_type" => "some vote_type"}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, agenda_item_vote_path(conn, :create), agenda_item_vote: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update agenda_item_vote" do
    setup [:create_agenda_item_vote]

    test "renders agenda_item_vote when data is valid", %{conn: conn, agenda_item_vote: %AgendaItemVote{id: id} = agenda_item_vote} do
      conn = put conn, agenda_item_vote_path(conn, :update, agenda_item_vote), agenda_item_vote: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, agenda_item_vote_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "version" => 43,
        "vote_type" => "some updated vote_type"}
    end

    test "renders errors when data is invalid", %{conn: conn, agenda_item_vote: agenda_item_vote} do
      conn = put conn, agenda_item_vote_path(conn, :update, agenda_item_vote), agenda_item_vote: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete agenda_item_vote" do
    setup [:create_agenda_item_vote]

    test "deletes chosen agenda_item_vote", %{conn: conn, agenda_item_vote: agenda_item_vote} do
      conn = delete conn, agenda_item_vote_path(conn, :delete, agenda_item_vote)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, agenda_item_vote_path(conn, :show, agenda_item_vote)
      end
    end
  end

  defp create_agenda_item_vote(_) do
    agenda_item_vote = fixture(:agenda_item_vote)
    {:ok, agenda_item_vote: agenda_item_vote}
  end
end
