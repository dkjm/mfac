defmodule MfacWeb.AgendaItemControllerTest do
  use MfacWeb.ConnCase

  alias Mfac.Meetings
  alias Mfac.Meetings.AgendaItem

  @create_attrs %{allotted_duration: 42, body: "some body", status: "some status", title: "some title", version: 42}
  @update_attrs %{allotted_duration: 43, body: "some updated body", status: "some updated status", title: "some updated title", version: 43}
  @invalid_attrs %{allotted_duration: nil, body: nil, status: nil, title: nil, version: nil}

  def fixture(:agenda_item) do
    {:ok, agenda_item} = Meetings.create_agenda_item(@create_attrs)
    agenda_item
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all agendaitems", %{conn: conn} do
      conn = get conn, agenda_item_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create agenda_item" do
    test "renders agenda_item when data is valid", %{conn: conn} do
      conn = post conn, agenda_item_path(conn, :create), agenda_item: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, agenda_item_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "allotted_duration" => 42,
        "body" => "some body",
        "status" => "some status",
        "title" => "some title",
        "version" => 42}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, agenda_item_path(conn, :create), agenda_item: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update agenda_item" do
    setup [:create_agenda_item]

    test "renders agenda_item when data is valid", %{conn: conn, agenda_item: %AgendaItem{id: id} = agenda_item} do
      conn = put conn, agenda_item_path(conn, :update, agenda_item), agenda_item: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, agenda_item_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "allotted_duration" => 43,
        "body" => "some updated body",
        "status" => "some updated status",
        "title" => "some updated title",
        "version" => 43}
    end

    test "renders errors when data is invalid", %{conn: conn, agenda_item: agenda_item} do
      conn = put conn, agenda_item_path(conn, :update, agenda_item), agenda_item: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete agenda_item" do
    setup [:create_agenda_item]

    test "deletes chosen agenda_item", %{conn: conn, agenda_item: agenda_item} do
      conn = delete conn, agenda_item_path(conn, :delete, agenda_item)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, agenda_item_path(conn, :show, agenda_item)
      end
    end
  end

  defp create_agenda_item(_) do
    agenda_item = fixture(:agenda_item)
    {:ok, agenda_item: agenda_item}
  end
end
