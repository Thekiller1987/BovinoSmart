import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.EnfermedadAdapter
import com.example.bovinosmart.R
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class ListEnfermedadesActivity : AppCompatActivity() {
    private lateinit var enfermedadRepo: EnfermedadRepository
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: EnfermedadAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_listar_enfermedades)

        enfermedadRepo = EnfermedadRepository(this)
        recyclerView = findViewById(R.id.recycler_view_enfermedades)
        recyclerView.layoutManager = LinearLayoutManager(this)

        GlobalScope.launch {
            val enfermedades = enfermedadRepo.getAll()
            runOnUiThread {
                adapter = EnfermedadAdapter(enfermedades) { enfermedad ->
                    val intent = Intent(this@ListEnfermedadesActivity, EditEnfermedadActivity::class.java).apply {
                        putExtra("ENFERMEDAD_ID", enfermedad.id)
                    }
                    startActivity(intent)
                }
                recyclerView.adapter = adapter
            }
        }
    }
}
