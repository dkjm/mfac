# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Mfac.Repo.insert!(%Mfac.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Mfac.Repo
alias Mfac.Meetings.Meeting
alias Mfac.Accounts.User

defmodule Seeds do
	def make_user() do
		Repo.insert! %User{
			first_name: "Mark",
			last_name: "Pare",
			is_active: true,
			middle_name: "Paul",
			suffix: "",
		}
	end

	def make_meeting(user_id) do
		Repo.insert! %Meeting{
			title: "Meeting",
			description: "description",
			allotted_duration: 0,
			version: 0,
			user_id: user_id,
		}
	end


	def make(index) do
		user = make_user()
		#IO.inspect user


		meeting = make_meeting(user.id)
		IO.inspect meeting
		#Enum.map(0..1, make_topic(user.id))
	end

end

Enum.map(0..1, &Seeds.make(&1))



