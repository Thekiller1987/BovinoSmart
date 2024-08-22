import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView

class BañosAdapter(context: Context, private val baños: List<ControlBanos>) :
    ArrayAdapter<ControlBanos>(context, 0, baños) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val baño = getItem(position)
        val view = convertView ?: LayoutInflater.from(context).inflate(android.R.layout.simple_list_item_2, parent, false)
        val text1 = view.findViewById<TextView>(android.R.id.text1)
        val text2 = view.findViewById<TextView>(android.R.id.text2)

        text1.text = baño?.fecha
        text2.text = baño?.productosUtilizados

        return view
    }
}
