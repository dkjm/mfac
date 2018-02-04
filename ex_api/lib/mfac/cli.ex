# defmodule Mfac.CLI do
#   alias Mfac.Repo 
#   alias Mfac.Accounts.User
#   Faker.start
  

#   def main(args \\ []) do
#     args
#     |> IO.inspect(label: "original args")
#     |> parse_args
#     |> response
#     |> IO.puts()
#   end

#   defp parse_args(args) do
#     {opts, word, _} =
#       args
#       |> OptionParser.parse(switches: [ makedata: :boolean, deletedata: :boolean]) |> IO.inspect(label: "FROM THE PARSER")

#     {opts, List.to_string(word)}
#   end

#   defp insert_topic_data do
#     Enum.map(1..10, fn _x -> 
#       Topic.changeset(%Topic{}, %{ body: Faker.Lorem.paragraph(%Range{first: 1, last: 3}), version: 0, title: Faker.Lorem.word })
#       |> Repo.insert!
#     end)
#   end

#   defp insert_topic_comment_data do
#     Enum.map(1..10, fn _x -> 
#       TopicComment.changeset(%TopicComment{}, %{ body: Faker.Lorem.paragraph(%Range{first: 1, last: 3}), version: 0})
#       |> Repo.insert!
#     end)
#   end

#   defp insert_stack_data do
#     Enum.map(1..10, fn _x -> 
#       Stack.changeset(%Stack{}, %{ version: 0})
#       |> Repo.insert!
#     end)
#   end

#   defp insert_user_data do
#     Enum.map(1..10, fn _x -> 
#       User.changeset(%User{}, %{first_name: Faker.Name.first_name, last_name: Faker.Name.last_name, is_active: true})
#       |> Repo.insert!
#     end)
#   end

#   defp make_associations do 
#     users = Repo.all(User)
#     topics = Repo.all(Topic)
#     topic_comments = Repo.all(TopicComment)
#     stack = Repo.all(Stack)

#     Enum.each(topics, fn x ->
#       user = Enum.at(users, :rand.uniform(length(users) - 1))
#       Topic.changeset(x, %{user_id: user.id})
#       |> Repo.update!
#     end)

#     Enum.each(topic_comments, fn x ->
#       user = Enum.at(users, :rand.uniform(length(users) - 1))
#       topic = Enum.at(topic_comments, :rand.uniform(length(topic_comments) - 1)) |> IO.inspect(label: "TOPIC:   ")
#       TopicComment.changeset(x, %{user_id: user.id, topic_id: topic.id })
#       |>IO.inspect(label: "topic comment changeset")
#       |> Repo.update!
#     end)

#   end


#   defp make_data(word) do
#     IO.puts "Making data of type #{word}"
#     case word do
#       "topics" -> 
#         insert_topic_data()
#         |> IO.inspect(label: "INSERTED TOPICS")
#         "All Set, 10 topics inserted"
#       "topic_comments" -> 
#         insert_topic_comment_data()
#         |> IO.inspect(label: "INSERTED TOPIC COMMENTS")
#         "All Set, 10 topic_comments inserted"
#       "stacks" -> 
#         insert_stack_data()
#         |> IO.inspect(label: "INSERTED STACKS")
#         "All Set, 10 stacks inserted"
#       "users" ->
#         insert_user_data()
#         |> IO.inspect(label: "INSERTED USERS")
#         "All Set, 10 users inserted"
#       "all" -> 
#         insert_topic_data()
#         insert_topic_comment_data()
#         insert_stack_data()
#         insert_user_data()
#         make_associations()
#         "All set, data made with associations"
#       _ -> 
#        "Whoops"  

#     end
    
#   end

#   defp delete_data(word) do
#     IO.puts "Deleting data of type #{word}"
#     case word do
#       "topics" ->
#         {num, _} = Repo.delete_all(Topic)
#         "All Set, deleted #{num} #{word}"
#       "topic_comments" -> 
#         {num, _} = Repo.delete_all(TopicComment)
#         "All Set, deleted #{num} #{word}"
#       "stacks" ->
#         {num, _} = Repo.delete_all(Stack)
#         "All Set, deleted #{num} #{word}"
#       "users" ->
#         {num, _} = Repo.delete_all(User)
#         "All Set, deleted #{num} #{word}"
#       "all" ->
#         Repo.delete_all(Topic)
#         Repo.delete_all(TopicComment)
#         Repo.delete_all(Stack)
#         Repo.delete_all(User)
#         "All set, everything deleted"
#       _ -> 
#         "Whoops"
#     end
#   end

#   defp response({opts, word}) do
#     IO.inspect(opts)
#     IO.inspect(word)
#     case opts do
#       [makedata: true] -> 
#         make_data(word)
#       [deletedata: true] -> 
#         delete_data(word)
#       _ -> 
#         IO.puts "I can't figure out what to do with that"
#     end
#   end
# end
