class AddArtistToDrawings < ActiveRecord::Migration[5.2]
  def change
    add_column :drawings, :artist, :string
  end
end
