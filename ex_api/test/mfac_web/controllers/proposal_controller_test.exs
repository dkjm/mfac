defmodule MfacWeb.ProposalControllerTest do
  use MfacWeb.ConnCase

  alias Mfac.Meetings
  alias Mfac.Meetings.Proposal

  @create_attrs %{decided_at: "2010-04-17 14:00:00.000000Z", description: "some description", meeting_action: "some meeting_action", status: "some status", title: "some title", version: 42}
  @update_attrs %{decided_at: "2011-05-18 15:01:01.000000Z", description: "some updated description", meeting_action: "some updated meeting_action", status: "some updated status", title: "some updated title", version: 43}
  @invalid_attrs %{decided_at: nil, description: nil, meeting_action: nil, status: nil, title: nil, version: nil}

  def fixture(:proposal) do
    {:ok, proposal} = Meetings.create_proposal(@create_attrs)
    proposal
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all proposals", %{conn: conn} do
      conn = get conn, proposal_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create proposal" do
    test "renders proposal when data is valid", %{conn: conn} do
      conn = post conn, proposal_path(conn, :create), proposal: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, proposal_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "decided_at" => "2010-04-17 14:00:00.000000Z",
        "description" => "some description",
        "meeting_action" => "some meeting_action",
        "status" => "some status",
        "title" => "some title",
        "version" => 42}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, proposal_path(conn, :create), proposal: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update proposal" do
    setup [:create_proposal]

    test "renders proposal when data is valid", %{conn: conn, proposal: %Proposal{id: id} = proposal} do
      conn = put conn, proposal_path(conn, :update, proposal), proposal: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, proposal_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "decided_at" => "2011-05-18 15:01:01.000000Z",
        "description" => "some updated description",
        "meeting_action" => "some updated meeting_action",
        "status" => "some updated status",
        "title" => "some updated title",
        "version" => 43}
    end

    test "renders errors when data is invalid", %{conn: conn, proposal: proposal} do
      conn = put conn, proposal_path(conn, :update, proposal), proposal: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete proposal" do
    setup [:create_proposal]

    test "deletes chosen proposal", %{conn: conn, proposal: proposal} do
      conn = delete conn, proposal_path(conn, :delete, proposal)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, proposal_path(conn, :show, proposal)
      end
    end
  end

  defp create_proposal(_) do
    proposal = fixture(:proposal)
    {:ok, proposal: proposal}
  end
end
