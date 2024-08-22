import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView
import com.example.bovinosmart.R

class AnimalAdapter(context: Context, animales: List<Animal>) :
    ArrayAdapter<Animal>(context, 0, animales) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val animal = getItem(position)
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_animal, parent, false)

        val nombreTextView = view.findViewById<TextView>(R.id.textview_nombre_animal)
        val imagenImageView = view.findViewById<ImageView>(R.id.imageview_animal)

        nombreTextView.text = animal?.nombre

        animal?.imagen?.let {
            val decodedString = Base64.decode(it, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
            imagenImageView.setImageBitmap(bitmap)
        }

        return view
    }
}
