import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity
import com.example.bovinosmart.R

class ListaBanosActivity : AppCompatActivity() {
    private lateinit var controlBanosRepo: ControlBanosRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_banos)

        controlBanosRepo = ControlBanosRepository(this)

        val botonAgregar = findViewById<Button>(R.id.btn_add_bath)
        val listaBanos = findViewById<ListView>(R.id.lv_baths)

        botonAgregar.setOnClickListener {
            val intent = Intent(this, ControlBanosActivity::class.java)
            startActivity(intent)
        }

        // Cargar y mostrar la lista de baños
        val baños = controlBanosRepo.getAll()
        val adapter = BañosAdapter(this, baños)
        listaBanos.adapter = adapter
    }
}
