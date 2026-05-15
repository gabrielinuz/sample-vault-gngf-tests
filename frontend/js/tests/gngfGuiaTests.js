/**
 * Función para asegurar independencia de los tests de samples 
 * y no depender de otro test para tener un token de sesión válido
 */
 async function okLogin()
 {
    // 1. Login como productor (pepe) para obtener un token válido
     const response = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
     });
     const data = await response.json();
     // Guardamos el token para tests de samples
     localStorage.setItem('test_token', data.token);
 }

 /**
 * 3. Solución: Eliminación de Samples (Dinámica)
 * Implementación del método DELETE asegurádose de que 
 * el sample existe obteniendo la lista previamente.
 */
/**
 * Test: DELETE /api/samples/:id
 */
 testUtils.createTestButton("Ej03 - Test Eliminar Sample Dinámico", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // 2. Obtener lista de samples para encontrar un ID real
    const listResponse = await fetch('/api/samples/my-samples', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const samples = await listResponse.json();

    // Validar si el usuario tiene samples para borrar
    if (!samples || samples.length === 0) {
        testUtils.log({ message: "No hay samples disponibles para probar el borrado. Suba uno primero." }, true);
        return;
    }

    // Tomamos el ID del primer sample encontrado
    const targetId = samples[0].id;
    testUtils.log({ info: `Intentando borrar sample con ID dinámico: ${targetId}` });

    // 3. Realizar la petición DELETE al ID obtenido dinámicamente
    const response = await fetch(`/api/samples/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.ok) {
        testUtils.setSuccess(btn);
    }
});
